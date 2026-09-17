# =========================================================
# FINEXA — SMART FINANCIAL ANALYTICS PLATFORM
# Auroun DataSYN
# =========================================================

from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    url_for,
    session,
    send_file
)

from werkzeug.utils import secure_filename

import os
import json
import uuid
import re
import io

from datetime import datetime

import pandas as pd


# =========================================================
# REPORTLAB
# =========================================================

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.lib.units import mm

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image
)


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)

app.secret_key = "finexa-2026"


# =========================================================
# BASE DIRECTORIES
# =========================================================

BASE = os.path.dirname(
    os.path.abspath(__file__)
)


UPLOADS = os.path.join(
    BASE,
    "uploads"
)


ANALYSIS = os.path.join(
    BASE,
    "analysis_data"
)


os.makedirs(
    UPLOADS,
    exist_ok=True
)


os.makedirs(
    ANALYSIS,
    exist_ok=True
)


# =========================================================
# SUPPORTED FILES
# =========================================================

ALLOWED = {
    "csv",
    "xlsx",
    "xls",
    "json"
}


# =========================================================
# FILE CHECK
# =========================================================

def allowed_file(filename):

    return (
        bool(filename)
        and "." in filename
        and filename.rsplit(
            ".",
            1
        )[1].lower() in ALLOWED
    )
    # =========================================================
# DATA CLEANING
# =========================================================

def clean_dataframe(df):

    if df is None or df.empty:

        raise ValueError(
            "The uploaded file contains no usable data."
        )


    df = df.copy()


    # Clean column names

    df.columns = [

        str(column).strip()

        for column in df.columns

    ]


    # Remove empty rows

    df = df.dropna(
        how="all"
    )


    # Remove empty columns

    df = df.dropna(
        axis=1,
        how="all"
    )


    # Reset index

    df = df.reset_index(
        drop=True
    )


    if (
        df.empty
        or len(df.columns) == 0
    ):

        raise ValueError(
            "No usable rows or columns were found."
        )


    return df


# =========================================================
# SEMANTIC COLUMN ALIASES
# =========================================================

ALIASES = {

    "date": [
        "date",
        "datetime",
        "timestamp",
        "month",
        "year",
        "period"
    ],

    "revenue": [
        "revenue",
        "income",
        "turnover",
        "total revenue"
    ],

    "sales": [
        "sales",
        "sale",
        "sales amount",
        "net sales"
    ],

    "expense": [
        "expense",
        "expenses",
        "cost"
    ],

    "profit": [
        "profit",
        "net profit",
        "gross profit"
    ],

    "price": [
        "price",
        "unit price",
        "selling price",
        "rate"
    ],

    "quantity": [
        "quantity",
        "qty",
        "units",
        "stock"
    ],

    "product": [
        "product",
        "product name",
        "item",
        "item name",
        "menu item"
    ],

    "category": [
        "category",
        "type",
        "class",
        "department",
        "segment",
        "group"
    ],

    "customer": [
        "customer",
        "customer name",
        "client",
        "buyer"
    ],

    "employee": [
        "employee",
        "employee name",
        "staff",
        "worker"
    ],

    "salary": [
        "salary",
        "pay",
        "wage"
    ],

    "age": [
        "age"
    ],

    "marks": [
        "marks",
        "mark",
        "score",
        "scores"
    ],

    "rating": [
        "rating",
        "review score",
        "star rating"
    ],

    "location": [
        "location",
        "city",
        "state",
        "country",
        "region",
        "area"
    ]
}


# =========================================================
# NORMALIZE COLUMN NAME
# =========================================================

def normalize(text):

    return re.sub(
        r"[^a-z0-9]+",
        " ",
        str(text).lower()
    ).strip()


# =========================================================
# DETECT SEMANTIC COLUMNS
# =========================================================

def detect_columns(df):

    result = {}

    columns = list(
        df.columns
    )


    normalized = {

        column: normalize(column)

        for column in columns

    }


    for semantic_name, aliases in ALIASES.items():

        found = None


        # Exact match

        for column in columns:

            column_name = normalized[column]


            normalized_aliases = [

                normalize(alias)

                for alias in aliases

            ]


            if column_name in normalized_aliases:

                found = column

                break


        # Partial match

        if found is None:

            for column in columns:

                column_name = normalized[column]


                for alias in aliases:

                    normalized_alias = normalize(
                        alias
                    )


                    if (
                        normalized_alias
                        and normalized_alias
                        in column_name
                    ):

                        found = column
                        break


                if found:

                    break


        result[
            semantic_name
        ] = found


    return result
# =========================================================
# KPI GENERATION
# =========================================================

def make_kpis(
    df,
    detected
):

    kpis = []


    # -----------------------------------------------------
    # TOTAL RECORDS
    # -----------------------------------------------------

    kpis.append({

        "title": "Total Records",

        "value": f"{len(df):,}",

        "type": "count",

        "description":
            "Records analyzed in the dataset."

    })


    # -----------------------------------------------------
    # TOTAL COLUMNS
    # -----------------------------------------------------

    kpis.append({

        "title": "Total Columns",

        "value": f"{len(df.columns):,}",

        "type": "count",

        "description":
            "Columns detected in the dataset."

    })


    numeric_columns = (

        df.select_dtypes(
            include="number"
        )
        .columns
        .tolist()

    )


    # -----------------------------------------------------
    # FINANCIAL METRICS
    # -----------------------------------------------------

    for key in [

        "revenue",
        "sales",
        "profit",
        "expense"

    ]:

        column = detected.get(
            key
        )


        if (
            column is not None
            and column in numeric_columns
        ):

            values = pd.to_numeric(

                df[column],

                errors="coerce"

            ).dropna()


            if values.empty:
                continue


            total = values.sum()


            kpis.append({

                "title":
                    key.title(),

                "value":
                    f"{total:,.2f}",

                "type":
                    key,

                "description":
                    f"Total {key} calculated from available records."

            })


    # -----------------------------------------------------
    # AVERAGE PRICE
    # -----------------------------------------------------

    price = detected.get(
        "price"
    )


    if (
        price is not None
        and price in numeric_columns
    ):

        values = pd.to_numeric(

            df[price],

            errors="coerce"

        ).dropna()


        if not values.empty:

            average = values.mean()


            kpis.append({

                "title":
                    "Average Price",

                "value":
                    f"{average:,.2f}",

                "type":
                    "average",

                "description":
                    f"Average {price} across available records."

            })


    # -----------------------------------------------------
    # QUANTITY
    # -----------------------------------------------------

    quantity = detected.get(
        "quantity"
    )


    if (
        quantity is not None
        and quantity in numeric_columns
    ):

        values = pd.to_numeric(

            df[quantity],

            errors="coerce"

        ).dropna()


        if not values.empty:

            total_quantity = values.sum()


            kpis.append({

                "title":
                    "Total Quantity",

                "value":
                    f"{total_quantity:,.2f}",

                "type":
                    "quantity",

                "description":
                    f"Total {quantity} across available records."

            })


    return kpis[:8]
# =========================================================
# CHART DATA GENERATION
# =========================================================

def make_charts(
    df,
    detected
):

    charts = []


    numeric = (

        df.select_dtypes(
            include="number"
        )
        .columns
        .tolist()

    )


    # =====================================================
    # HISTOGRAM
    # =====================================================

    if numeric:

        column = numeric[0]


        values = pd.to_numeric(

            df[column],

            errors="coerce"

        ).dropna()


        if not values.empty:

            charts.append({

                "type":
                    "histogram",

                "title":
                    f"{column} Distribution",

                "column":
                    column,

                "labels":
                    [],

                "values":
                    values.head(100).tolist()

            })


    # =====================================================
    # CATEGORY + METRIC
    # =====================================================

    category = (

        detected.get("category")

        or detected.get("product")

        or detected.get("customer")

        or detected.get("employee")

        or detected.get("location")

    )


    metric = None


    for key in [

        "revenue",
        "sales",
        "profit",
        "expense",
        "price",
        "quantity"

    ]:

        column = detected.get(
            key
        )


        if (
            column is not None
            and column in numeric
        ):

            metric = column

            break


    # Fallback numeric field

    if (
        metric is None
        and numeric
    ):

        metric = numeric[0]


    # -----------------------------------------------------
    # BAR CHART
    # -----------------------------------------------------

    if (
        category is not None
        and metric is not None
    ):

        temp = df[
            [category, metric]
        ].copy()


        temp[metric] = pd.to_numeric(

            temp[metric],

            errors="coerce"

        )


        temp = temp.dropna(
            subset=[category, metric]
        )


        if not temp.empty:

            grouped = (

                temp.groupby(
                    category
                )[metric]
                .sum()
                .sort_values(
                    ascending=False
                )
                .head(10)

            )


            charts.append({

                "type":
                    "bar",

                "title":
                    f"{metric} by {category}",

                "labels": [

                    str(x)

                    for x in grouped.index

                ],

                "values": [

                    float(x)

                    for x in grouped.values

                ]

            })


    # =====================================================
    # DATE + METRIC
    # =====================================================

    date_column = detected.get(
        "date"
    )


    if (
        date_column is not None
        and metric is not None
    ):

        temp = df[
            [date_column, metric]
        ].copy()


        temp[date_column] = pd.to_datetime(

            temp[date_column],

            errors="coerce"

        )


        temp[metric] = pd.to_numeric(

            temp[metric],

            errors="coerce"

        )


        temp = temp.dropna()


        if not temp.empty:

            grouped = (

                temp.groupby(
                    date_column
                )[metric]
                .sum()
                .sort_index()
                .head(100)

            )


            charts.append({

                "type":
                    "line",

                "title":
                    f"{metric} Trend",

                "labels": [

                    str(x.date())
                    for x in grouped.index

                ],

                "values": [

                    float(x)

                    for x in grouped.values

                ]

            })


    return charts
# =========================================================
# INSIGHTS
# =========================================================

def make_insights(
    df,
    detected
):

    insights = []


    # -----------------------------------------------------
    # OVERVIEW
    # -----------------------------------------------------

    insights.append({

        "title":
            "Dataset Overview",

        "text": (

            f"FINEXA analyzed "
            f"{len(df):,} records across "
            f"{len(df.columns)} columns."

        )

    })


    # -----------------------------------------------------
    # NUMERIC ANALYSIS
    # -----------------------------------------------------

    numeric = (

        df.select_dtypes(
            include="number"
        )
        .columns
        .tolist()

    )


    if numeric:

        column = numeric[0]


        values = pd.to_numeric(

            df[column],

            errors="coerce"

        ).dropna()


        if not values.empty:

            insights.append({

                "title":
                    f"{column} Analysis",

                "text": (

                    f"Average {column} is "
                    f"{values.mean():,.2f}. "
                    f"Maximum is "
                    f"{values.max():,.2f} "
                    f"and minimum is "
                    f"{values.min():,.2f}."

                )

            })


    # -----------------------------------------------------
    # HIGHEST VALUE RECORD
    # -----------------------------------------------------

    entity_column = (

        detected.get("product")

        or detected.get("customer")

        or detected.get("employee")

        or detected.get("category")

    )


    if (
        entity_column is not None
        and numeric
    ):

        metric = numeric[0]


        temp = df[
            [entity_column, metric]
        ].copy()


        temp[metric] = pd.to_numeric(

            temp[metric],

            errors="coerce"

        )


        temp = temp.dropna()


        if not temp.empty:

            row = temp.loc[
                temp[metric].idxmax()
            ]


            insights.append({

                "title":
                    "Highest Value Record",

                "text": (

                    f"{row[entity_column]} "
                    f"has the highest "
                    f"{metric} value of "
                    f"{row[metric]:,.2f}."

                )

            })


    # -----------------------------------------------------
    # DATA QUALITY
    # -----------------------------------------------------

    missing = int(

        df.isna()
        .sum()
        .sum()

    )


    insights.append({

        "title":
            "Data Quality",

        "text": (

            "No missing values detected."

            if missing == 0

            else
            f"{missing:,} missing cells detected."

        )

    })


    return insights[:6]


# =========================================================
# BUILD COMPLETE ANALYSIS
# =========================================================

def analyze_dataframe(
    df,
    filename,
    sheet_name
):

    detected = detect_columns(
        df
    )


    numeric_columns = (

        df.select_dtypes(
            include="number"
        )
        .columns
        .tolist()

    )


    result = {

        "id":
            str(uuid.uuid4()),

        "filename":
            filename,

        "dataset_name":
            filename,

        "sheet":
            sheet_name,

        "sheet_name":
            sheet_name,

        "summary": {

            "total_records":
                len(df),

            "total_columns":
                len(df.columns),

            "numeric_fields":
                len(numeric_columns),

            "text_fields":
                len(df.columns)
                - len(numeric_columns)

        },

        "columns": [

            str(column)

            for column in df.columns

        ],

        "numeric_columns": [
        str(column)

            for column in numeric_columns

        ],

        "detected_columns":
            detected,

        "kpis":
            make_kpis(
                df,
                detected
            ),

        "charts":
            make_charts(
                df,
                detected
            ),

        "insights":
            make_insights(
                df,
                detected
            ),

        "preview":
            df.head(50)
            .fillna("")
            .to_dict(
                orient="records"
            )

    }


    return result
# =========================================================
# SAVE ANALYSIS
# =========================================================

def save_result(
    result
):

    path = os.path.join(

        ANALYSIS,

        result["id"] + ".json"

    )


    with open(

        path,

        "w",

        encoding="utf-8"

    ) as file:

        json.dump(

            result,

            file,

            ensure_ascii=False,

            indent=2,

            default=str

        )


# =========================================================
# LOAD ANALYSIS
# =========================================================

def load_result():

    analysis_id = session.get(
        "analysis_id"
    )


    if not analysis_id:
        return None


    path = os.path.join(

        ANALYSIS,

        analysis_id + ".json"

    )


    if not os.path.exists(path):
        return None


    with open(

        path,

        "r",

        encoding="utf-8"

    ) as file:

        return json.load(file)
        # =========================================================
# PAGE ROUTES
# =========================================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


@app.route("/demo")
def demo():

    return render_template(
        "demo.html"
    )


@app.route("/upload")
def upload():

    return render_template(
        "upload.html"
    )


@app.route("/result")
def result():

    return render_template(
        "result.html"
    )
    
@app.route("/features")
def features():
    return render_template("features.html")


@app.route("/premium")
def premium():

    return render_template(
        "premium.html"
    )


@app.route("/contact", methods=["GET", "POST"])
def contact():

    if request.method == "POST":

        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        phone = request.form.get("phone", "").strip()
        subject = request.form.get("subject", "").strip()
        message = request.form.get("message", "").strip()

        print("\n========================================")
        print("FINEXA CONTACT FORM")
        print("========================================")
        print("Name:", name)
        print("Email:", email)
        print("Phone:", phone)
        print("Subject:", subject)
        print("Message:", message)
        print("========================================\n")

        return render_template(
            "contact.html",
            success_message="Thanks for contacting us! We will contact you within 24 hours."
        )

    return render_template(
        "contact.html"
    )
    # =========================================================
# MAIN ANALYSIS ROUTE
# =========================================================

@app.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    if "file" not in request.files:

        return jsonify(
            success=False,
            error="No file uploaded."
        ), 400


    file = request.files["file"]


    if not file.filename:

        return jsonify(
            success=False,
            error="Please select a file."
        ), 400


    if not allowed_file(
        file.filename
    ):

        return jsonify(

            success=False,

            error=(
                "Supported files: "
                "CSV, XLSX, XLS and JSON."
            )

        ), 400


    filename = secure_filename(
        file.filename
    )


    path = os.path.join(

        UPLOADS,

        uuid.uuid4().hex
        + "_"
        + filename

    )


    try:

        # -------------------------------------------------
        # SAVE UPLOAD
        # -------------------------------------------------

        file.save(path)


        extension = (

            filename.rsplit(
                ".",
                1
            )[1].lower()

        )


        sheet_name = None

        sheets = []


        # =================================================
        # CSV
        # =================================================

        if extension == "csv":

            try:

                df = pd.read_csv(

                    path,

                    encoding="utf-8"

                )

            except UnicodeDecodeError:

                try:

                    df = pd.read_csv(

                        path,

                        encoding="cp1252"

                    )

                except UnicodeDecodeError:

                    df = pd.read_csv(

                        path,

                        encoding="latin1"

                    )


            sheet_name = "CSV"

            sheets = ["CSV"]


        # =================================================
        # JSON
        # =================================================

        elif extension == "json":

            with open(

                path,

                "r",

                encoding="utf-8"

            ) as file_object:

                data = json.load(
                    file_object
                )


            if isinstance(
                data,
                dict
            ):

                if isinstance(

                    data.get("data"),

                    list

                ):

                    data = data[
                        "data"
                    ]

                else:

                    data = [data]


            if not isinstance(
                data,
                list
            ):

                raise ValueError(

                    "JSON must contain "
                    "records or a data array."

                )


            df = pd.DataFrame(
                data
            )


            sheet_name = "JSON"

            sheets = ["JSON"]


        # =================================================
        # EXCEL
        # =================================================

        else:

            workbook = pd.read_excel(

                path,

                sheet_name=None

            )


            usable = {

                str(name):
                    data

                for name, data
                in workbook.items()

                if data is not None
                and not data.empty

            }


            if not usable:

                raise ValueError(

                    "No usable Excel sheet found."

                )


            # Largest populated sheet

            sheet_name = max(

                usable,

                key=lambda name:
                    len(
                        usable[name]
                    )

            )


            df = usable[
                sheet_name
            ]
            sheets = list(
                usable.keys()
            )


        # -------------------------------------------------
        # CLEAN
        # -------------------------------------------------

        df = clean_dataframe(
            df
        )


        # -------------------------------------------------
        # ANALYZE
        # -------------------------------------------------

        result = analyze_dataframe(

            df,

            filename,

            sheet_name

        )


        result[
            "available_sheets"
        ] = sheets


        # -------------------------------------------------
        # SAVE
        # -------------------------------------------------

        save_result(
            result
        )


        # -------------------------------------------------
        # SESSION
        # -------------------------------------------------

        session[
            "analysis_id"
        ] = result["id"]


        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        return jsonify(

            success=True,

            redirect=url_for(
                "result"
            ),

            analysis_id=result["id"]

        )


    except Exception as error:

        print(
            "\nFINEXA ANALYSIS ERROR:"
        )

        print(
            str(error)
        )


        return jsonify(

            success=False,

            error=str(error)

        ), 500


    finally:

        try:

            if os.path.exists(
                path
            ):

                os.remove(path)

        except Exception:
            pass
        # =========================================================
# RESULT API
# =========================================================

@app.route(
    "/api/analysis"
)
def api_analysis():

    result = load_result()


    if not result:

        return jsonify(

            success=False,

            error="No analysis found."

        ), 404


    return jsonify(
        result
    )


# =========================================================
# DATA API
# =========================================================

@app.route(
    "/api/data"
)
def api_data():

    result = load_result()


    if not result:

        return jsonify(

            success=False,

            error="No analysis found."

        ), 404


    return jsonify(

        success=True,

        columns=result.get(
            "columns",
            []
        ),

        rows=result.get(
            "preview",
            []
        )

    )


# =========================================================
# DATASET INFO
# =========================================================

@app.route(
    "/api/dataset-info"
)
def dataset_info():

    result = load_result()


    if not result:

        return jsonify(

            success=False,

            error="No analysis found."

        ), 404


    return jsonify(

        success=True,

        dataset_name=result.get(
            "dataset_name",
            "Uploaded Dataset"
        ),

        sheet_name=result.get(
            "sheet_name",
            "Dataset Analysis"
        ),

        available_sheets=result.get(
            "available_sheets",
            []
        ),

        summary=result.get(
            "summary",
            {}
        ),

        detected_columns=result.get(
            "detected_columns",
            {}
        )

    )
    # =========================================================
# CLEAR ANALYSIS
# =========================================================

@app.route(
    "/api/clear-analysis",
    methods=["POST"]
)
def clear_analysis():

    analysis_id = session.pop(
        "analysis_id",
        None
    )


    if analysis_id:

        path = os.path.join(

            ANALYSIS,

            analysis_id + ".json"

        )


        if os.path.exists(path):

            os.remove(path)


    return jsonify(
        success=True
    )


# =========================================================
# HEALTH
# =========================================================

@app.route("/health")
def health():

    return jsonify(

        status="ok",

        platform="FINEXA",

        version="1.0"

    )


# =========================================================
# FINEXA — BRANDED PDF REPORT
# =========================================================

@app.route(
    "/download-report"
)
def download_report():

    try:

        result = load_result()


        if not result:

            return jsonify(

                success=False,

                error=
                    "No analysis is available."

            ), 404


        # -------------------------------------------------
        # DATA
        # -------------------------------------------------

        filename = (

            result.get("filename")

            or result.get("dataset_name")

            or "Uploaded Dataset"

        )


        sheet_name = (

            result.get("sheet_name")

            or result.get("sheet")

            or "Dataset Analysis"

        )


        summary = result.get(
            "summary",
            {}
        )


        kpis = result.get(
            "kpis",
            []
        )


        insights = result.get(
            "insights",
            []
        )


        # -------------------------------------------------
        # PDF BUFFER
        # -------------------------------------------------

        buffer = io.BytesIO()


        # -------------------------------------------------
        # DOCUMENT
        # -------------------------------------------------

        document = SimpleDocTemplate(

            buffer,

            pagesize=A4,

            rightMargin=18 * mm,

            leftMargin=18 * mm,

            topMargin=25 * mm,

            bottomMargin=22 * mm

        )


        styles = getSampleStyleSheet()


        # -------------------------------------------------
        # STYLES
        # -------------------------------------------------

        brand_style = ParagraphStyle(

            "FinexaBrand",

            parent=styles["Normal"],

            fontName="Helvetica-Bold",

            fontSize=9,

            textColor=
                colors.HexColor(
                    "#5145b5"
                ),

            spaceAfter=4

        )


        title_style = ParagraphStyle(

            "FinexaTitle",

            parent=styles["Title"],

            fontName="Helvetica-Bold",

            fontSize=23,

            leading=27,

            textColor=
                colors.HexColor(
                    "#17142a"
                ),

            spaceAfter=5

        )


        subtitle_style = ParagraphStyle(

            "FinexaSubtitle",

            parent=styles["Normal"],

            fontName="Helvetica",

            fontSize=9,

            leading=13,

            textColor=
                colors.HexColor(
                    "#666666"
                ),

            spaceAfter=15

        )


        section_style = ParagraphStyle(

            "FinexaSection",

            parent=styles["Heading2"],

            fontName="Helvetica-Bold",

            fontSize=13,

            leading=17,

            textColor=
                colors.HexColor(
                    "#3d3291"
                ),

            spaceBefore=17,

            spaceAfter=9

        )


        normal_style = ParagraphStyle(

            "FinexaNormal",
            parent=styles["Normal"],

            fontName="Helvetica",

            fontSize=8.5,

            leading=13,

            textColor=
                colors.HexColor(
                    "#444444"
                )

        )


        small_style = ParagraphStyle(

            "FinexaSmall",

            parent=styles["Normal"],

            fontName="Helvetica",

            fontSize=7.5,

            leading=11,

            textColor=
                colors.HexColor(
                    "#666666"
                )

        )


        # -------------------------------------------------
        # STORY
        # -------------------------------------------------

        story = []


        # -------------------------------------------------
        # LOGO
        # -------------------------------------------------

        logo_path = os.path.join(

            BASE,

            "static",

            "css",

            "logo.png"

        )


        if os.path.exists(
            logo_path
        ):

            logo = Image(

                logo_path,

                width=22 * mm,

                height=22 * mm

            )


            story.append(
                logo
            )


            story.append(
                Spacer(1, 5)
            )


        # -------------------------------------------------
        # BRAND
        # -------------------------------------------------

        story.append(

            Paragraph(

                "AUROUN DATASYN",

                brand_style

            )

        )


        story.append(

            Paragraph(

                "FINEXA",

                title_style

            )

        )


        story.append(

            Paragraph(

                "Smart Financial Analytics Platform",

                subtitle_style

            )

        )


        story.append(

            Paragraph(

                "OFFICIAL DATA INTELLIGENCE REPORT",

                ParagraphStyle(

                    "OfficialReport",

                    parent=small_style,

                    fontName="Helvetica-Bold",

                    textColor=
                        colors.HexColor(
                            "#5145b5"
                        ),

                    spaceAfter=8

                )

            )

        )


        # -------------------------------------------------
        # REPORT META
        # -------------------------------------------------

        meta_data = [

            [

                Paragraph(
                    "<b>Dataset</b>",
                    small_style
                ),

                Paragraph(
                    str(filename),
                    small_style
                )

            ],

            [

                Paragraph(
                    "<b>Sheet</b>",
                    small_style
                ),

                Paragraph(
                    str(sheet_name),
                    small_style
                )

            ],

            [

                Paragraph(
                    "<b>Analysis Date</b>",
                    small_style
                ),

                Paragraph(

                    datetime.now().strftime(
                        "%d %B %Y"
                    ),

                    small_style

                )

            ],

            [

                Paragraph(
                    "<b>Platform</b>",
                    small_style
                ),

                Paragraph(

                    "FINEXA by Auroun DataSYN",

                    small_style

                )

            ]

        ]


        meta_table = Table(

            meta_data,

            colWidths=[

                38 * mm,

                125 * mm

            ]

        )


        meta_table.setStyle(

            TableStyle([

                (

                    "BACKGROUND",

                    (0, 0),

                    (0, -1),

                    colors.HexColor(
                        "#f2efff"
                    )
                    ),

                (

                    "BOX",

                    (0, 0),

                    (-1, -1),

                    0.5,

                    colors.HexColor(
                        "#d8d4e8"
                    )

                ),

                (

                    "INNERGRID",

                    (0, 0),

                    (-1, -1),

                    0.3,

                    colors.HexColor(
                        "#e5e5e5"
                    )

                ),

                (

                    "VALIGN",

                    (0, 0),

                    (-1, -1),

                    "MIDDLE"

                ),

                (

                    "LEFTPADDING",

                    (0, 0),

                    (-1, -1),

                    8

                ),

                (

                    "RIGHTPADDING",

                    (0, 0),

                    (-1, -1),

                    8

                ),

                (

                    "TOPPADDING",

                    (0, 0),

                    (-1, -1),

                    7

                ),

                (

                    "BOTTOMPADDING",

                    (0, 0),

                    (-1, -1),

                    7

                )

            ])

        )


        story.append(
            meta_table
        )


        # -------------------------------------------------
        # DATASET INTELLIGENCE
        # -------------------------------------------------

        story.append(

            Paragraph(

                "Dataset Intelligence",

                section_style

            )

        )


        intelligence_data = [

            [

                "Total Records",

                str(

                    summary.get(
                        "total_records",
                        0
                    )

                )

            ],

            [

                "Total Columns",

                str(

                    summary.get(
                        "total_columns",
                        0
                    )

                )

            ],

            [

                "Numeric Fields",

                str(

                    summary.get(
                        "numeric_fields",
                        0
                    )

                )

            ],

            [

                "Text Fields",

                str(

                    summary.get(
                        "text_fields",
                        0
                    )

                )

            ]

        ]


        intelligence_table = Table(

            intelligence_data,

            colWidths=[

                48 * mm,

                35 * mm

            ]

        )


        intelligence_table.setStyle(

            TableStyle([

                (

                    "BACKGROUND",

                    (0, 0),

                    (-1, -1),

                    colors.HexColor(
                        "#faf9fd"
                    )

                ),

                (

                    "GRID",

                    (0, 0),

                    (-1, -1),

                    0.35,

                    colors.HexColor(
                        "#dddddd"
                    )

                ),

                (

                    "FONTNAME",

                    (0, 0),

                    (-1, -1),

                    "Helvetica"

                ),

                (

                    "FONTSIZE",

                    (0, 0),

                    (-1, -1),

                    8

                ),

                (

                    "LEFTPADDING",

                    (0, 0),

                    (-1, -1),

                    8

                ),

                (

                    "TOPPADDING",

                    (0, 0),

                    (-1, -1),

                    7

                ),

                (

                    "BOTTOMPADDING",

                    (0, 0),
                    (-1, -1),

                    7

                )

            ])

        )


        story.append(
            intelligence_table
        )


        # -------------------------------------------------
        # KPIs
        # -------------------------------------------------

        if kpis:

            story.append(

                Paragraph(

                    "Key Performance Indicators",

                    section_style

                )

            )


            kpi_rows = []


            for kpi in kpis[:8]:

                label = (

                    kpi.get("label")

                    or kpi.get("title")

                    or kpi.get("name")

                    or "Metric"

                )


                value = (

                    kpi.get("value")

                    if kpi.get("value")
                    is not None

                    else
                    kpi.get(
                        "metric",
                        "—"
                    )

                )


                description = (

                    kpi.get("description")

                    or kpi.get(
                        "subtitle",
                        ""
                    )

                )


                kpi_rows.append([

                    Paragraph(

                        f"<b>{str(label)}</b>",

                        small_style

                    ),

                    Paragraph(

                        str(value),

                        small_style

                    ),

                    Paragraph(

                        str(description),

                        small_style

                    )

                ])


            kpi_table = Table(

                kpi_rows,

                colWidths=[

                    48 * mm,

                    35 * mm,

                    85 * mm

                ]

            )


            kpi_table.setStyle(

                TableStyle([

                    (

                        "GRID",

                        (0, 0),

                        (-1, -1),

                        0.35,

                        colors.HexColor(
                            "#dddddd"
                        )

                    ),

                    (

                        "BACKGROUND",

                        (0, 0),

                        (-1, -1),

                        colors.HexColor(
                            "#fafafa"
                        )

                    ),

                    (

                        "VALIGN",

                        (0, 0),

                        (-1, -1),

                        "TOP"

                    ),

                    (

                        "LEFTPADDING",

                        (0, 0),

                        (-1, -1),

                        7

                    ),

                    (

                        "RIGHTPADDING",

                        (0, 0),

                        (-1, -1),

                        7

                    ),

                    (

                        "TOPPADDING",

                        (0, 0),

                        (-1, -1),

                        7

                    ),

                    (

                        "BOTTOMPADDING",

                        (0, 0),

                        (-1, -1),

                        7

                    )

                ])

            )


            story.append(
                kpi_table
            )


        # -------------------------------------------------
        # INSIGHTS
        # -------------------------------------------------

        if insights:

            story.append(

                Paragraph(

                    "FINEXA Insights",

                    section_style

                )

            )


            for insight in insights[:8]:

                title = (

                    insight.get("title")

                    or insight.get(
                        "name"
                    )
                    or "Data Insight"

                )


                text = (

                    insight.get("text")

                    or insight.get(
                        "description"
                    )

                    or insight.get(
                        "message"
                    )

                    or insight.get(
                        "insight"
                    )

                    or ""

                )


                story.append(

                    Paragraph(

                        f"<b>{str(title)}</b>",

                        normal_style

                    )

                )


                story.append(

                    Paragraph(

                        str(text),

                        small_style

                    )

                )


                story.append(
                    Spacer(1, 5)
                )


        # -------------------------------------------------
        # OWNER SIGNATURE
        # -------------------------------------------------

        story.append(
            Spacer(1, 20)
        )


        signature_data = [[

            Paragraph(

                "<b>Arun Kumar Saxena</b><br/>"
                "Chief Managing Director<br/>"
                "Auroun DataSYN",

                small_style

            ),

            Paragraph(

                "<b>FINEXA</b><br/>"
                "Smart Financial Analytics Platform<br/>"
                "Powered by Auroun DataSYN",

                small_style

            )

        ]]


        signature_table = Table(

            signature_data,

            colWidths=[

                80 * mm,

                80 * mm

            ]

        )


        signature_table.setStyle(

            TableStyle([

                (

                    "BACKGROUND",

                    (0, 0),

                    (-1, -1),

                    colors.HexColor(
                        "#f4f1ff"
                    )

                ),

                (

                    "BOX",

                    (0, 0),

                    (-1, -1),

                    0.6,

                    colors.HexColor(
                        "#d5cff8"
                    )

                ),

                (

                    "VALIGN",

                    (0, 0),

                    (-1, -1),

                    "MIDDLE"

                ),

                (

                    "LEFTPADDING",

                    (0, 0),

                    (-1, -1),

                    10

                ),

                (

                    "TOPPADDING",

                    (0, 0),

                    (-1, -1),

                    10

                ),

                (

                    "BOTTOMPADDING",

                    (0, 0),

                    (-1, -1),

                    10

                )

            ])

        )


        story.append(
            signature_table
        )


        #-------------------------------------------------
        # PAGE FOOTER
        # -------------------------------------------------

        def draw_footer(
            canvas,
            doc
        ):

            canvas.saveState()


            width, height = A4


            canvas.setStrokeColor(

                colors.HexColor(
                    "#5145b5"
                )

            )


            canvas.setLineWidth(
                0.7
            )


            canvas.line(

                18 * mm,

                15 * mm,

                width - 18 * mm,

                15 * mm

            )


            canvas.setFont(

                "Helvetica",

                7

            )


            canvas.setFillColor(

                colors.HexColor(
                    "#777777"
                )

            )


            canvas.drawString(

                18 * mm,

                9 * mm,

                "Powered by Auroun DataSYN"

            )


            canvas.drawCentredString(

                width / 2,

                9 * mm,

                "FINEXA • Smart Financial Analytics Platform"

            )


            canvas.drawRightString(

                width - 18 * mm,

                9 * mm,

                f"Page {doc.page}"

            )


            canvas.restoreState()


        # -------------------------------------------------
        # BUILD
        # -------------------------------------------------

        document.build(

            story,

            onFirstPage=draw_footer,

            onLaterPages=draw_footer

        )


        buffer.seek(0)


        # -------------------------------------------------
        # SEND PDF
        # -------------------------------------------------

        return send_file(

            buffer,

            mimetype="application/pdf",

            as_attachment=True,

            download_name=
                "FINEXA_Analysis_Report.pdf"

        )


    except Exception as error:

        print(
            "\nFINEXA REPORT ERROR:"
        )

        print(
            str(error)
        )


        return jsonify(

            success=False,

            error=(
                "Report generation failed: "
                + str(error)
            )

        ), 500
        # =========================================================
# RUN FINEXA
# =========================================================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )
