document.addEventListener("DOMContentLoaded", () => {

    const datasetName = document.getElementById("resultDatasetName");
    const sheetName = document.getElementById("resultSheetName");

    const totalRecords = document.getElementById("totalRecords");
    const totalColumns = document.getElementById("totalColumns");
    const numericFields = document.getElementById("numericFields");
    const textFields = document.getElementById("textFields");

    const dynamicKpiGrid =
        document.getElementById("dynamicKpiGrid");


    // =========================================================
    // LOAD ANALYSIS
    // =========================================================

    async function loadAnalysis() {

        try {

            const response = await fetch("/api/analysis");

            if (!response.ok) {
                throw new Error("Analysis could not be loaded.");
            }

            const data = await response.json();

            if (!data || data.success === false) {
                throw new Error(
                    data?.error || "No analysis available."
                );
            }

            displayDatasetInformation(data);

            buildDynamicKPIs(data);

        } catch (error) {

            console.error("FINEXA:", error);

            showEmptyState();

        }

    }


    // =========================================================
    // DATASET INFORMATION
    // =========================================================

    function displayDatasetInformation(data) {

        const summary = data.summary || {};

        if (datasetName) {
            datasetName.textContent =
                data.filename ||
                data.file_name ||
                "Uploaded Dataset";
        }

        if (sheetName) {

            if (data.sheet) {
                sheetName.textContent =
                    `Sheet: ${data.sheet}`;
            } else {
                sheetName.textContent =
                    "Dataset Analysis";
            }

        }

        if (totalRecords) {
            totalRecords.textContent =
                formatNumber(
                    summary.total_records ?? 0
                );
        }

        if (totalColumns) {
            totalColumns.textContent =
                formatNumber(
                    summary.total_columns ?? 0
                );
        }

        if (numericFields) {
            numericFields.textContent =
                formatNumber(
                    summary.numeric_fields ?? 0
                );
        }

        if (textFields) {
            textFields.textContent =
                formatNumber(
                    summary.text_fields ?? 0
                );
        }

    }


    // =========================================================
    // DYNAMIC KPI ENGINE
    // =========================================================

    function buildDynamicKPIs(data) {

        if (!dynamicKpiGrid) {
            return;
        }

        const kpis = data.kpis || [];

        dynamicKpiGrid.innerHTML = "";

        if (!kpis.length) {

            dynamicKpiGrid.innerHTML =`
                <div class="dynamic-kpi-card">
                    <div class="dynamic-kpi-top">
                        <span class="dynamic-kpi-label">
                            Dataset
                        </span>

                        <div class="dynamic-kpi-icon">
                            ◈
                        </div>
                    </div>

                    <div class="dynamic-kpi-value">
                        ${formatNumber(
                            data.summary?.total_records ?? 0
                        )}
                    </div>

                    <div class="dynamic-kpi-description">
                        Records analyzed
                    </div>
                </div>
            `;

            return;
        }

        kpis.slice(0, 8).forEach((kpi, index) => {

            const card = createKPICard(kpi, index);

            dynamicKpiGrid.appendChild(card);

        });

    }
    // =========================================================
    // CREATE KPI CARD
    // =========================================================

    function createKPICard(kpi, index) {

        const card =
            document.createElement("div");

        card.className =
            "dynamic-kpi-card";

        const label =
            kpi.label ||
            kpi.name ||
            kpi.title ||
            Metric `${index + 1}`;

        const value =
            kpi.value ??
            kpi.metric ??
            kpi.result ??
            0;

        const description =
            kpi.description ||
            kpi.subtitle ||
            "Detected from your dataset.";

        const icon =
            getKPIIcon(label);

        card.innerHTML =`
            <div class="dynamic-kpi-top">

                <span class="dynamic-kpi-label">
                    ${escapeHTML(label)}
                </span>

                <div class="dynamic-kpi-icon">
                    ${icon}
                </div>

            </div>

            <div class="dynamic-kpi-value">
                ${formatKPIValue(value)}
            </div>

            <div class="dynamic-kpi-description">
                ${escapeHTML(description)}
            </div>
        `;

        return card;

    }


    // =========================================================
    // KPI ICONS
    // =========================================================

    function getKPIIcon(label) {

        const text =
            String(label).toLowerCase();

        if (
            text.includes("revenue") ||
            text.includes("sales") ||
            text.includes("income") ||
            text.includes("amount")
        ) {
            return "₹";
        }

        if (
            text.includes("employee") ||
            text.includes("customer") ||
            text.includes("people") ||
            text.includes("student")
        ) {
            return "♙";
        }

        if (
            text.includes("average") ||
            text.includes("mean")
        ) {
            return "≈";
        }

        if (
            text.includes("highest") ||
            text.includes("maximum") ||
            text.includes("top")
        ) {
            return "↗";
        }

        if (
            text.includes("lowest") ||
            text.includes("minimum")
        ) {
            return "↘";
        }

        if (
            text.includes("price") ||
            text.includes("cost")
        ) {
            return "◫";
        }

        if (
            text.includes("order") ||
            text.includes("item") ||
            text.includes("product")
        ) {
            return "◈";
        }

        return "✦";

    }


    // =========================================================
    // KPI VALUE FORMAT
    // =========================================================

    function formatKPIValue(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }

        if (typeof value === "number") {

            return value.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            );

        }

        return escapeHTML(
            String(value)
        );

    }


    // =========================================================
    // NUMBER FORMATTER
    // =========================================================

    function formatNumber(value) {

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "0";
        }

        return number.toLocaleString("en-IN");

    }


    // =========================================================
    // HTML SAFETY
    // =========================================================

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    function showEmptyState() {

        if (datasetName) {
            datasetName.textContent =
                "No dataset loaded";
        }

        if (sheetName) {
            sheetName.textContent =
                "Analysis unavailable";
        }

        if (totalRecords) {
            totalRecords.textContent = "0";
        }

        if (totalColumns) {
            totalColumns.textContent = "0";
        }

        if (numericFields) {
            numericFields.textContent = "0";
        }

        if (textFields) {
            textFields.textContent = "0";
        }

        if (dynamicKpiGrid) {

            dynamicKpiGrid.innerHTML =`
                <div class="dynamic-kpi-card">

                    <div class="dynamic-kpi-top">
                        <span class="dynamic-kpi-label">
                            Analysis
                        </span>

                        <div class="dynamic-kpi-icon">
                            !
                        </div>
                    </div>

                    <div class="dynamic-kpi-value">
                        —
                    </div>

                    <div class="dynamic-kpi-description">
                        Upload a dataset to begin analysis.
                    </div>

                </div>
            `;

        }

    }

    // =========================================================
    // START FINEXA ANALYSIS
    // =========================================================

    loadAnalysis();

});
// =========================================================
// FINEXA RESULT PAGE — PART 2
// DYNAMIC ANALYTICS ENGINE
// =========================================================


// =========================================================
// ANALYTICS ELEMENTS
// =========================================================

const analyticsGrid =
    document.getElementById("dynamicAnalyticsGrid");

const analyticsEmptyState =
    document.getElementById("analyticsEmptyState");

const filterButtons =
    document.querySelectorAll(".analytics-filter");


// =========================================================
// LOAD ANALYTICS
// =========================================================

async function loadAnalytics() {

    if (!analyticsGrid) {
        return;
    }

    try {

        const response =
            await fetch("/api/analysis");

        if (!response.ok) {
            throw new Error(
                "Analytics could not be loaded."
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            data.success === false
        ) {
            throw new Error(
                data?.error ||
                "No analytics available."
            );
        }

        buildAnalytics(data);

    } catch (error) {

        console.error(
            "FINEXA Analytics:",
            error
        );

        showAnalyticsEmptyState();
    }
}


// =========================================================
// BUILD ANALYTICS
// =========================================================

function buildAnalytics(data) {

    const charts =
        Array.isArray(data.charts)
            ? data.charts
            : [];

    analyticsGrid.innerHTML = "";


    if (!charts.length) {

        showAnalyticsEmptyState();

        return;
    }


    if (analyticsEmptyState) {
        analyticsEmptyState.style.display =
            "none";
    }


    charts
        .slice(0, 8)
        .forEach((chart, index) => {

            const card =
                createAnalyticsCard(
                    chart,
                    index
                );

            analyticsGrid.appendChild(card);
        });


    activateChartFilters();
}


// =========================================================
// CREATE ANALYTICS CARD
// =========================================================

function createAnalyticsCard(chart, index) {

    const card =
        document.createElement("div");

    card.className =
        "analytics-chart-card";


    if (chart.wide === true) {
        card.classList.add("wide");
    }


    const title =
        chart.title ||
        chart.name ||
        Analysis `${index + 1}`;


    const subtitle =
        chart.description ||
        chart.subtitle ||
        "Automatically generated from your dataset.";


    const type =
        chart.type ||
        chart.chart_type ||
        "Analytics";


    card.dataset.chartType =
        normalizeChartType(type);


    card.innerHTML =`
        <div class="analytics-chart-header">

            <div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(subtitle)}
                </p>

            </div>

            <span class="analytics-chart-type">
                ${escapeHTML(String(type))}
            </span>

        </div>

        <div class="analytics-chart-area">

            ${createChartVisual(chart)}

        </div>

        <div class="analytics-chart-footer">

            <span>
                FINEXA ANALYSIS
            </span>

            <span>
                AUTO GENERATED
            </span>

        </div>
    `;


    return card;
}


// =========================================================
// CHART VISUAL
// =========================================================

function createChartVisual(chart) {

    const type =
        normalizeChartType(
            chart.type ||
            chart.chart_type ||
            ""
        );
        const labels =
        Array.isArray(chart.labels)
            ? chart.labels
            : (
                Array.isArray(chart.x)
                    ? chart.x
                    : []
            );


    const values =
        Array.isArray(chart.values)
            ? chart.values
            : (
                Array.isArray(chart.y)
                    ? chart.y
                    : []
            );


    // ---------------------------------------------------------
    // HISTOGRAM
    // ---------------------------------------------------------

    if (type === "histogram") {

        if (!values.length) {

            return`
                <div class="chart-data-message">
                    <span>◌</span>
                    <p>
                        Visualization data unavailable.
                    </p>
                </div>
            `;
        }

        return createHistogramChart(values);
    }


    // ---------------------------------------------------------
    // NORMAL CHARTS
    // ---------------------------------------------------------

    if (
        !labels.length ||
        !values.length
    ) {

        return` 
            <div class="chart-data-message">
                <span>◌</span>
                <p>
                    Visualization data unavailable.
                </p>
            </div>
        `;
    }


    if (
        type === "line" ||
        type === "trend"
    ) {

        return createLineChart(
            labels,
            values
        );
    }


    if (
        type === "bar" ||
        type === "comparison"
    ) {

        return createBarChart(
            labels,
            values
        );
    }


    if (
        type === "distribution"
    ) {

        return createBarChart(
            labels,
            values
        );
    }


    return createBarChart(
        labels,
        values
    );
}


// =========================================================
// HISTOGRAM
// =========================================================

function createHistogramChart(values) {

    const numbers =
        values
            .map(value => Number(value))
            .filter(value => Number.isFinite(value));


    if (!numbers.length) {

        return` 
            <div class="chart-data-message">
                <span>◌</span>
                <p>
                    Visualization data unavailable.
                </p>
            </div>
        `;
    }


    const minimum =
        Math.min(...numbers);

    const maximum =
        Math.max(...numbers);


    // Create approximately 8 bins.
    const binCount =
        Math.min(
            8,
            Math.max(4, numbers.length)
        );


    let binSize =
        (maximum - minimum) / binCount;


    // Handle identical values.
    if (
        !Number.isFinite(binSize) ||
        binSize === 0
    ) {
        binSize = 1;
    }


    const bins =
        Array.from(
            { length: binCount },
            () => 0
        );


    numbers.forEach(value => {

        let index =
            Math.floor(
                (value - minimum) / binSize
            );


        if (index >= binCount) {
            index = binCount - 1;
        }


        if (index < 0) {
            index = 0;
        }


        bins[index]++;
    });


    const maxFrequency =
        Math.max(...bins, 1);


    const bars =
        bins
            .map((frequency, index) => {

                const height =
                    Math.max(
                        8,
                        (frequency / maxFrequency) * 100
                    );


                const start =
                    minimum +
                    (index * binSize);


                const end =
                    start + binSize;


                const label =
                    `${formatChartValue(start)}–${formatChartValue(end)}`;


                return `
                    <div class="dynamic-bar-column">
                    <div class="dynamic-bar-value">
                            ${frequency}
                        </div>

                        <div
                            class="dynamic-bar"
                            style="height:${height}%;">
                        </div>

                        <div class="dynamic-bar-label">
                            ${escapeHTML(label)}
                        </div>

                    </div>
                `;
            })
            .join("");


    return` 
        <div class="dynamic-bar-chart">
            ${bars}
        </div>
    `;
}


// =========================================================
// BAR CHART
// =========================================================

function createBarChart(labels, values) {

    const pairs =
        labels
            .slice(0, 12)
            .map((label, index) => {

                const value =
                    Number(values[index]);

                return {
                    label: label,
                    value:
                        Number.isFinite(value)
                            ? value
                            : 0
                };
            });


    const maxValue =
        Math.max(
            ...pairs.map(item => item.value),
            1
        );


    const bars =
        pairs
            .map(item => {

                const height =
                    Math.max(
                        6,
                        (item.value / maxValue) * 100
                    );


                return`
                    <div class="dynamic-bar-column">

                        <div class="dynamic-bar-value">
                            ${formatChartValue(item.value)}
                        </div>

                        <div
                            class="dynamic-bar"
                            style="height:${height}%;">
                        </div>

                        <div class="dynamic-bar-label">
                            ${escapeHTML(
                                String(item.label)
                            )}
                        </div>

                    </div>
                `;
            })
            .join("");


    return`
        <div class="dynamic-bar-chart">
            ${bars}
        </div>
    `;
}


// =========================================================
// LINE CHART
// =========================================================

function createLineChart(labels, values) {

    const numericValues =
        values
            .slice(0, 12)
            .map(value => {

                const number =
                    Number(value);

                return Number.isFinite(number)
                    ? number
                    : 0;
            });


    const maxValue =
        Math.max(
            ...numericValues,
            1
        );


    const points =
        numericValues
            .map((value, index) => {

                const x =
                    numericValues.length === 1
                        ? 50
                        : (
                            index /
                            (numericValues.length - 1)
                        ) * 100;


                const y =
                    100 -
                    (
                        (value / maxValue) *
                        85
                    );


                return `${x},${y}`;

            })
            .join(" ");


    const labelsHTML =
        labels
            .slice(0, 12)
            .map(label =>`
                <span>
                    ${escapeHTML(
                        String(label)
                    )}
                </span>
            `)
            .join("");


    return`
        <div class="dynamic-line-chart">

            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                class="dynamic-line-svg">
                <polyline
                    points="${points}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    vector-effect="non-scaling-stroke">
                </polyline>

            </svg>

            <div class="dynamic-line-labels">
                ${labelsHTML}
            </div>

        </div>
    `;
}


// =========================================================
// NORMALIZE CHART TYPE
// =========================================================

function normalizeChartType(type) {

    const value =
        String(type)
            .toLowerCase()
            .trim();


    if (
        value.includes("line") ||
        value.includes("trend")
    ) {
        return "trend";
    }


    if (
        value.includes("histogram")
    ) {
        return "histogram";
    }


    if (
        value.includes("distribution")
    ) {
        return "distribution";
    }


    if (
        value.includes("bar") ||
        value.includes("comparison")
    ) {
        return "comparison";
    }


    return "comparison";
}


// =========================================================
// CHART VALUE FORMAT
// =========================================================

function formatChartValue(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "—";
    }


    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
}


// =========================================================
// EMPTY STATE
// =========================================================

function showAnalyticsEmptyState() {

    if (analyticsGrid) {
        analyticsGrid.innerHTML = "";
    }


    if (analyticsEmptyState) {
        analyticsEmptyState.style.display =
            "block";
    }
}


// =========================================================
// CHART FILTERS
// =========================================================

function activateChartFilters() {

    filterButtons.forEach(button => {

        button.onclick = () => {

            filterButtons.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            const filter =
                button.dataset.chartFilter;


            const cards =
                analyticsGrid.querySelectorAll(
                    ".analytics-chart-card"
                );


            cards.forEach(card => {

                if (
                    filter === "all" ||
                    card.dataset.chartType === filter
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";
                }

            });

        };

    });
}


// =========================================================
// HTML SAFETY
// =========================================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =========================================================
// START ANALYTICS
// =========================================================

loadAnalytics();
// =========================================================
// FINEXA RESULT PAGE — PART 4
// INTELLIGENT INSIGHTS ENGINE
// =========================================================


// =========================================================
// INSIGHT ELEMENTS
// =========================================================

const dynamicInsightsGrid =
    document.getElementById("dynamicInsightsGrid");

const insightsEmptyState =
    document.getElementById("insightsEmptyState");


// =========================================================
// LOAD INSIGHTS
// =========================================================

async function loadInsights() {

    if (!dynamicInsightsGrid) {
        return;
    }

    try {

        const response =
            await fetch("/api/analysis");

        if (!response.ok) {
            throw new Error(
                "Insights could not be loaded."
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            data.success === false
        ) {
            throw new Error(
                data?.error ||
                "No insights available."
            );
        }

        buildDynamicInsights(data);

    } catch (error) {

        console.error(
            "FINEXA Insights:",
            error
        );

        showInsightsEmptyState();
    }
}


// =========================================================
// BUILD INSIGHTS
// =========================================================

function buildDynamicInsights(data) {

    const insights =
        Array.isArray(data.insights)
            ? data.insights
            : [];


    dynamicInsightsGrid.innerHTML = "";


    if (!insights.length) {

        showInsightsEmptyState();

        return;
    }


    if (insightsEmptyState) {
        insightsEmptyState.style.display =
            "none";
    }


    insights
        .slice(0, 6)
        .forEach((insight, index) => {

            const card =
                createInsightCard(
                    insight,
                    index
                );

            dynamicInsightsGrid.appendChild(card);
        });
}


// =========================================================
// CREATE INSIGHT CARD
// =========================================================

function createInsightCard(insight, index) {

    const card =
        document.createElement("article");

    card.className =
        "dynamic-insight-card";


    const title =
        insight.title ||
        insight.name ||
        insight.heading ||
        Insight `${index + 1}`;


    const description =
        insight.description ||
        insight.text ||
        insight.message ||
        insight.insight ||
        "FINEXA identified a meaningful observation in your dataset.";


    const category =
        insight.category ||
        insight.type ||
        "DATA INSIGHT";


    const value =
        insight.value ??
        insight.metric ??
        insight.result ??
        null;


    const icon =
        getInsightIcon(category);


    card.innerHTML =` 
        <div class="dynamic-insight-top">

            <span class="dynamic-insight-category">
                ${escapeHTML(
                    String(category)
                )}
            </span>

            <div class="dynamic-insight-icon">
                ${icon}
            </div>

        </div>


        <h3>
            ${escapeHTML(
                String(title)
            )}
        </h3>


        <p>
            ${escapeHTML(
                String(description)
            )}
        </p>


        ${
            value !== null &&
            value !== undefined &&
            value !== ""
                ? 
                    `<div class="dynamic-insight-value">
                        ${formatInsightValue(value)}
                    </div>`
                  
                : ""
        }

    `;


    return card;
}


// =========================================================
// INSIGHT ICONS
// =========================================================
function getInsightIcon(category) {

    const text =
        String(category)
            .toLowerCase();


    if (
        text.includes("trend") ||
        text.includes("growth")
    ) {
        return "↗";
    }


    if (
        text.includes("risk") ||
        text.includes("warning")
    ) {
        return "!";
    }


    if (
        text.includes("average") ||
        text.includes("mean")
    ) {
        return "≈";
    }


    if (
        text.includes("highest") ||
        text.includes("maximum") ||
        text.includes("top")
    ) {
        return "↑";
    }


    if (
        text.includes("lowest") ||
        text.includes("minimum")
    ) {
        return "↓";
    }


    if (
        text.includes("recommend") ||
        text.includes("action")
    ) {
        return "✦";
    }


    if (
        text.includes("data") ||
        text.includes("quality")
    ) {
        return "◈";
    }


    return "✦";
}


// =========================================================
// INSIGHT VALUE FORMAT
// =========================================================

function formatInsightValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }


    if (typeof value === "number") {

        return value.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
    }


    return escapeHTML(
        String(value)
    );
}


// =========================================================
// EMPTY STATE
// =========================================================

function showInsightsEmptyState() {

    if (dynamicInsightsGrid) {
        dynamicInsightsGrid.innerHTML = "";
    }


    if (insightsEmptyState) {
        insightsEmptyState.style.display =
            "block";
    }
}


// =========================================================
// START INSIGHTS
// =========================================================

loadInsights();
// =========================================================
// FINEXA RESULT PAGE — PART 5
// DATA HEALTH & RECOMMENDATIONS ENGINE
// =========================================================

const healthScore =
    document.getElementById("healthScore");

const healthScoreRing =
    document.getElementById("healthScoreRing");

const healthStatusBadge =
    document.getElementById("healthStatusBadge");

const healthScoreTitle =
    document.getElementById("healthScoreTitle");

const healthScoreDescription =
    document.getElementById("healthScoreDescription");

const healthCompleteness =
    document.getElementById("healthCompleteness");

const healthValidData =
    document.getElementById("healthValidData");

const healthNumericFields =
    document.getElementById("healthNumericFields");

const healthDataIssues =
    document.getElementById("healthDataIssues");

const dynamicRecommendationsGrid =
    document.getElementById("dynamicRecommendationsGrid");

const recommendationsEmptyState =
    document.getElementById("recommendationsEmptyState");


// =========================================================
// NUMBER FORMATTER
// =========================================================

function formatHealthNumber(value) {

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
}


// =========================================================
// LOAD HEALTH ANALYSIS
// =========================================================

async function loadHealthAnalysis() {

    if (!dynamicRecommendationsGrid) {
        return;
    }

    try {

        const response =
            await fetch("/api/analysis");

        if (!response.ok) {
            throw new Error(
                "Health analysis could not be loaded."
            );
        }

        const data =
            await response.json();

        if (!data || data.success === false) {

            throw new Error(
                data?.error ||
                "No health analysis available."
            );
        }

        buildHealthOverview(data);
        buildRecommendations(data);

    } catch (error) {

        console.error(
            "FINEXA Health:",
            error
        );

        showHealthFallback();
    }
}


// =========================================================
// BUILD HEALTH OVERVIEW
// =========================================================

function buildHealthOverview(data) {

    const summary =
        data.summary || {};

    const totalRecords =
        Number(summary.total_records || 0);

    const totalColumns =
        Number(summary.total_columns || 0);

    const numericCount =
        Number(summary.numeric_fields || 0);

    const columns =
        Array.isArray(data.columns)
            ? data.columns
            : [];

    const preview =
        Array.isArray(data.preview)
            ? data.preview
            : [];

    let missingCells = 0;
    let totalCells = 0;


    if (preview.length && columns.length) {

        totalCells =
            preview.length * columns.length;

        preview.forEach(row => {

            columns.forEach(column => {

                const value =
                    row?.[column];

                if (
                    value === null ||
                    value === undefined ||
                    String(value).trim() === ""
                ) {
                    missingCells++;
                }

            });

        });

    }


    let completeness = 100;

    if (totalCells > 0) {

        completeness =
            Math.round(
                (
                    (totalCells - missingCells) /
                    totalCells
                ) * 100
            );

    }


    completeness =
        Math.max(
            0,
            Math.min(
                100,
                completeness
            )
        );


    const validPercentage =
        completeness;

    const issueCount =
        missingCells;
        const score =
        calculateHealthScore(
            completeness,
            totalRecords,
            totalColumns,
            numericCount
        );


    updateHealthScore(score);


    if (healthCompleteness) {

        healthCompleteness.textContent =
            `${completeness}%`;

    }


    if (healthValidData) {

        healthValidData.textContent =
            `${validPercentage}%`;

    }


    if (healthNumericFields) {

        healthNumericFields.textContent =
            formatHealthNumber(
                numericCount
            );

    }


    if (healthDataIssues) {

        healthDataIssues.textContent =
            formatHealthNumber(
                issueCount
            );

    }

}


// =========================================================
// CALCULATE HEALTH SCORE
// =========================================================

function calculateHealthScore(
    completeness,
    totalRecords,
    totalColumns,
    numericCount
) {

    let score =
        completeness;


    if (totalRecords === 0) {
        return 0;
    }


    if (totalColumns === 0) {
        return 0;
    }


    if (numericCount === 0) {
        score -= 5;
    }


    return Math.max(
        0,
        Math.min(
            100,
            Math.round(score)
        )
    );

}


// =========================================================
// UPDATE HEALTH SCORE
// =========================================================

function updateHealthScore(score) {

    if (healthScore) {

        healthScore.textContent =
            score;

    }


    if (healthScoreRing) {

        const degrees =
            score * 3.6;

        healthScoreRing.style.background =
            `conic-gradient(
                #7c5cff 0deg,
                #4b8cff ${degrees}deg,
                rgba(255,255,255,0.07) ${degrees}deg
            )`;

    }


    if (
        !healthStatusBadge ||
        !healthScoreTitle ||
        !healthScoreDescription
    ) {
        return;
    }


    if (score >= 90) {

        healthStatusBadge.textContent =
            "EXCELLENT";

        healthScoreTitle.textContent =
            "Healthy Dataset";

        healthScoreDescription.textContent =
            "Your dataset contains a strong level of usable and complete information.";

    } else if (score >= 75) {

        healthStatusBadge.textContent =
            "GOOD";

        healthScoreTitle.textContent =
            "Good Data Quality";

        healthScoreDescription.textContent =
            "The dataset is suitable for analysis with only minor quality considerations.";

    } else if (score >= 50) {

        healthStatusBadge.textContent =
            "FAIR";

        healthScoreTitle.textContent =
            "Some Data Gaps Found";

        healthScoreDescription.textContent =
            "FINEXA detected areas that may need attention before deeper analysis.";

    } else {

        healthStatusBadge.textContent =
            "NEEDS ATTENTION";

        healthScoreTitle.textContent =
            "Data Quality Needs Attention";

        healthScoreDescription.textContent =
            "Several data-quality issues may affect the reliability of analysis.";

    }

}


// =========================================================
// BUILD RECOMMENDATIONS
// =========================================================

function buildRecommendations(data) {

    if (!dynamicRecommendationsGrid) {
        return;
    }


    const recommendations =
        generateRecommendations(data);


    dynamicRecommendationsGrid.innerHTML =
        "";


    if (!recommendations.length) {

        showRecommendationsEmptyState();

        return;

    }


    if (recommendationsEmptyState) {

        recommendationsEmptyState.style.display =
            "none";

    }


    recommendations
        .slice(0, 6)
        .forEach(
            (recommendation, index) => {

                const card =
                    createRecommendationCard(
                        recommendation,
                        index
                    );
                    dynamicRecommendationsGrid
                    .appendChild(card);

            }
        );

}


// =========================================================
// DYNAMIC RECOMMENDATION ENGINE
// =========================================================

function generateRecommendations(data) {

    const recommendations = [];

    const summary =
        data.summary || {};


    const totalRecords =
        Number(summary.total_records || 0);

    const totalColumns =
        Number(summary.total_columns || 0);

    const numericFields =
        Number(summary.numeric_fields || 0);

    const textFields =
        Number(summary.text_fields || 0);


    const columns =
        Array.isArray(data.columns)
            ? data.columns
            : [];

    const preview =
        Array.isArray(data.preview)
            ? data.preview
            : [];


    // -----------------------------------------------------
    // DATA COMPLETENESS
    // -----------------------------------------------------

    let missingCells = 0;
    let totalCells = 0;


    if (preview.length && columns.length) {

        totalCells =
            preview.length * columns.length;


        preview.forEach(row => {

            columns.forEach(column => {

                const value =
                    row?.[column];


                if (
                    value === null ||
                    value === undefined ||
                    String(value).trim() === ""
                ) {

                    missingCells++;

                }

            });

        });

    }


    if (missingCells > 0) {

        recommendations.push({

            category: "DATA QUALITY",

            title: "Review Missing Values",

            description:
                `${formatHealthNumber(missingCells)} missing values were detected in the available dataset preview. Review these fields before making important decisions.`,

            icon: "!"

        });

    }


    // -----------------------------------------------------
    // NUMERIC ANALYSIS
    // -----------------------------------------------------

    if (numericFields > 0) {

        recommendations.push({

            category: "ANALYTICS",

            title: "Explore Numeric Patterns",

            description:
                `FINEXA detected ${formatHealthNumber(numericFields)} numeric field${numericFields === 1 ? "" : "s"}. Compare averages, ranges and distributions to uncover useful patterns.`,

            icon: "≈"

        });

    }


    // -----------------------------------------------------
    // CATEGORY ANALYSIS
    // -----------------------------------------------------

    if (textFields > 0) {

        recommendations.push({

            category: "SEGMENTATION",

            title: "Compare Categories",

            description:
                `Your dataset contains ${formatHealthNumber(textFields)} text or categorical field${textFields === 1 ? "" : "s"}. Grouping these values can reveal differences between segments.`,

            icon: "◈"

        });

    }


    // -----------------------------------------------------
    // LARGE DATASET
    // -----------------------------------------------------

    if (totalRecords >= 100) {

        recommendations.push({

            category: "DATA EXPLORATION",

            title: "Investigate Record-Level Patterns",

            description:
                `With ${formatHealthNumber(totalRecords)} records available, filtering and segmenting the dataset can help identify patterns that overall averages may hide.`,

            icon: "↗"

        });

    }


    // -----------------------------------------------------
    // MANY COLUMNS
    // -----------------------------------------------------

    if (totalColumns >= 8) {

        recommendations.push({

            category: "DATA STRUCTURE",

            title: "Focus On Key Variables",
            description:
                `FINEXA detected ${formatHealthNumber(totalColumns)} columns. Start with the fields most relevant to your objective before exploring secondary variables.`,

            icon: "✦"

        });

    }


    // -----------------------------------------------------
    // GENERAL RECOMMENDATION
    // -----------------------------------------------------

    if (!recommendations.length) {

        recommendations.push({

            category: "FINEXA",

            title: "Explore Your Dataset",

            description:
                "Use the analytics and data explorer sections to investigate the relationships and patterns available in your uploaded data.",

            icon: "✦"

        });

    }


    return recommendations;

}


// =========================================================
// CREATE RECOMMENDATION CARD
// =========================================================

function createRecommendationCard(
    recommendation,
    index
) {

    const card =
        document.createElement("article");


    card.className =
        "dynamic-recommendation-card";


    const category =
        recommendation.category ||
        "FINEXA";


    const title =
        recommendation.title ||
        `Recommendation ${index + 1}`;


    const description =
        recommendation.description ||
        "FINEXA identified a useful action from your dataset.";


    const icon =
        recommendation.icon ||
        getRecommendationIcon(category);


    card.innerHTML =` 
        <div class="dynamic-recommendation-top">

            <span class="dynamic-recommendation-category">
                ${escapeHTML(String(category))}
            </span>

            <div class="dynamic-recommendation-icon">
                ${escapeHTML(String(icon))}
            </div>

        </div>

        <h4>
            ${escapeHTML(String(title))}
        </h4>

        <p>
            ${escapeHTML(String(description))}
        </p>
    `;


    return card;

}


// =========================================================
// RECOMMENDATION ICON
// =========================================================

function getRecommendationIcon(category) {

    const text =
        String(category).toLowerCase();


    if (
        text.includes("quality") ||
        text.includes("data")
    ) {
        return "!";
    }


    if (
        text.includes("analytics") ||
        text.includes("pattern")
    ) {
        return "≈";
    }


    if (
        text.includes("segment") ||
        text.includes("category")
    ) {
        return "◈";
    }


    if (
        text.includes("exploration")
    ) {
        return "↗";
    }


    return "✦";

}


// =========================================================
// EMPTY STATE
// =========================================================

function showRecommendationsEmptyState() {

    if (dynamicRecommendationsGrid) {

        dynamicRecommendationsGrid.innerHTML =
            "";

    }


    if (recommendationsEmptyState) {

        recommendationsEmptyState.style.display =
            "block";

    }

}


// =========================================================
// FALLBACK
// =========================================================

function showHealthFallback() {

    if (healthScore) {
        healthScore.textContent = "—";
    }


    if (healthStatusBadge) {
        healthStatusBadge.textContent =
            "UNAVAILABLE";
    }


    if (healthScoreTitle) {
        healthScoreTitle.textContent =
            "Analysis Unavailable";
    }


    if (healthScoreDescription) {
        healthScoreDescription.textContent =
            "FINEXA could not calculate the dataset health information.";
    }


    if (healthCompleteness) {
        healthCompleteness.textContent =
            "—";
    }


    if (healthValidData) {
        healthValidData.textContent =
            "—";
    }


    if (healthNumericFields) {
        healthNumericFields.textContent =
            "—";
    }
    if (healthDataIssues) {
        healthDataIssues.textContent =
            "—";
    }


    showRecommendationsEmptyState();

}


// =========================================================
// START HEALTH ANALYSIS
// =========================================================

loadHealthAnalysis();
// =========================================================
// PART 5 — VISUAL ANALYTICS
// Dynamic Bar Chart + Dynamic Line Chart
// =========================================================

const dynamicBarChart =
    document.getElementById("dynamicBarChart");

const dynamicLineChart =
    document.getElementById("dynamicLineChart");

const barChartTitle =
    document.getElementById("barChartTitle");

const barChartDescription =
    document.getElementById("barChartDescription");

const barChartXAxis =
    document.getElementById("barChartXAxis");

const barChartYAxis =
    document.getElementById("barChartYAxis");

const barChartField =
    document.getElementById("barChartField");

const lineChartTitle =
    document.getElementById("lineChartTitle");

const lineChartDescription =
    document.getElementById("lineChartDescription");

const lineChartXAxis =
    document.getElementById("lineChartXAxis");

const lineChartYAxis =
    document.getElementById("lineChartYAxis");

const lineChartField =
    document.getElementById("lineChartField");

const visualCategoryField =
    document.getElementById("visualCategoryField");

const visualMetricField =
    document.getElementById("visualMetricField");

const visualTimeField =
    document.getElementById("visualTimeField");

const visualStatusField =
    document.getElementById("visualStatusField");

const visualNoDataState =
    document.getElementById("visualNoDataState");


async function loadVisualAnalytics() {

    try {

        const response =
            await fetch("/api/analysis");

        if (!response.ok) {
            throw new Error(
                "Visual analytics could not be loaded."
            );
        }

        const data =
            await response.json();

        if (!data || data.success === false) {
            throw new Error(
                data?.error ||
                "No analysis available."
            );
        }

        const columns =
            Array.isArray(data.columns)
                ? data.columns
                : [];

        const preview =
            Array.isArray(data.preview)
                ? data.preview
                : [];

        if (!columns.length || !preview.length) {
            showVisualNoData();
            return;
        }

        const analysis =
            detectVisualFields(
                columns,
                preview
            );

        updateVisualSummary(analysis);

        buildDynamicBarChart(
            analysis,
            preview
        );

        buildDynamicLineChart(
            analysis,
            preview
        );

    } catch (error) {

        console.error(
            "FINEXA Visual Analytics:",
            error
        );

        showVisualNoData();
    }
}


/* =========================================================
   FIELD DETECTION
========================================================= */

function detectVisualFields(columns, rows) {

    const columnNames =
        columns.map(column => {

            if (typeof column === "string") {
                return column;
            }

            return (
                column?.name ||
                column?.field ||
                column?.column ||
                ""
            );
        }).filter(Boolean);


    const numericFields = [];
    const categoricalFields = [];
    const dateFields = [];


    columnNames.forEach(column => {

        const values =
            rows
                .map(row => getRowValue(row, column))
                .filter(
                    value =>
                        value !== null &&
                        value !== undefined &&
                        value !== ""
                );

        if (!values.length) {
            return;
        }


        const numericCount =
            values.filter(value =>
                isNumericValue(value)
            ).length;

        const dateCount =
            values.filter(value =>
                isDateValue(value)
            ).length;
            const numericRatio =
            numericCount / values.length;

        const dateRatio =
            dateCount / values.length;


        if (dateRatio >= 0.65) {

            dateFields.push({
                name: column,
                score: dateRatio
            });

        } else if (numericRatio >= 0.65) {

            numericFields.push({
                name: column,
                score: numericRatio
            });

        } else {

            const uniqueValues =
                new Set(
                    values.map(value =>
                        String(value)
                    )
                );

            if (
                uniqueValues.size >= 2 &&
                uniqueValues.size <= 30
            ) {
                categoricalFields.push({
                    name: column,
                    score:
                        1 -
                        (
                            uniqueValues.size /
                            Math.max(values.length, 1)
                        )
                });
            }
        }
    });


    const metric =
        chooseMetricField(
            numericFields,
            columnNames
        );


    const category =
        chooseCategoryField(
            categoricalFields,
            columnNames
        );


    const date =
        chooseDateField(
            dateFields,
            columnNames
        );


    return {
        numericFields,
        categoricalFields,
        dateFields,
        metric,
        category,
        date
    };
}


/* =========================================================
   METRIC DETECTION
========================================================= */

function chooseMetricField(
    numericFields,
    columns
) {

    if (!numericFields.length) {
        return null;
    }


    const preferredWords = [
        "revenue",
        "sales",
        "amount",
        "income",
        "profit",
        "value",
        "price",
        "cost",
        "salary",
        "expense",
        "quantity",
        "units",
        "orders",
        "score",
        "marks",
        "rating",
        "total"
    ];


    const preferred =
        numericFields.find(field => {

            const text =
                field.name.toLowerCase();

            return preferredWords.some(word =>
                text.includes(word)
            );
        });


    if (preferred) {
        return preferred.name;
    }


    return numericFields[0].name;
}


/* =========================================================
   CATEGORY DETECTION
========================================================= */

function chooseCategoryField(
    categoricalFields,
    columns
) {

    if (!categoricalFields.length) {
        return null;
    }


    const preferredWords = [
        "category",
        "product",
        "item",
        "name",
        "department",
        "region",
        "city",
        "country",
        "type",
        "segment",
        "brand",
        "class"
    ];


    const preferred =
        categoricalFields.find(field => {

            const text =
                field.name.toLowerCase();

            return preferredWords.some(word =>
                text.includes(word)
            );
        });


    if (preferred) {
        return preferred.name;
    }


    return categoricalFields[0].name;
}


/* =========================================================
   DATE DETECTION
========================================================= */

function chooseDateField(
    dateFields,
    columns
) {

    if (!dateFields.length) {
        return null;
    }


    const preferredWords = [
        "date",
        "time",
        "month",
        "year",
        "day",
        "created",
        "updated"
    ];


    const preferred =
        dateFields.find(field => {

            const text =
                field.name.toLowerCase();

            return preferredWords.some(word =>
                text.includes(word)
            );
        });
        if (preferred) {
        return preferred.name;
    }


    return dateFields[0].name;
}


/* =========================================================
   BAR CHART
========================================================= */

function buildDynamicBarChart(
    analysis,
    rows
) {

    if (!dynamicBarChart) {
        return;
    }


    const category =
        analysis.category;

    const metric =
        analysis.metric;


    if (!category || !metric) {

        dynamicBarChart.innerHTML =`
            <div class="visual-chart-loading">
                <p>
                    No compatible category and metric were found.
                </p>
            </div>
        `;

        if (barChartTitle) {
            barChartTitle.textContent =
                "Category Analysis";
        }

        if (barChartDescription) {
            barChartDescription.textContent =
                "This dataset does not contain compatible fields for a category comparison.";
        }

        return;
    }


    const grouped = {};


    rows.forEach(row => {

        const categoryValue =
            getRowValue(row, category);

        const metricValue =
            toNumber(
                getRowValue(row, metric)
            );


        if (
            categoryValue === null ||
            categoryValue === undefined ||
            categoryValue === "" ||
            metricValue === null
        ) {
            return;
        }


        const key =
            String(categoryValue);


        if (!grouped[key]) {
            grouped[key] = 0;
        }


        grouped[key] += metricValue;
    });


    let entries =
        Object.entries(grouped)
            .sort((a, b) => b[1] - a[1]);


    if (!entries.length) {

        dynamicBarChart.innerHTML =` 
            <div class="visual-chart-loading">
                <p>
                    No usable values were found for this chart.
                </p>
            </div>
        `;

        return;
    }


    entries =
        entries.slice(0, 8);


    const maxValue =
        Math.max(
            ...entries.map(entry => entry[1]),
            1
        );


    dynamicBarChart.innerHTML =`
        <div class="dynamic-bar-chart">
            ${entries.map(
                ([label, value]) => {

                    const height =
                        Math.max(
                            (value / maxValue) * 100,
                            4
                        );

                    return`
                        <div class="dynamic-bar-column">

                            <div class="dynamic-bar-value">
                                ${formatVisualNumber(value)}
                            </div>

                            <div
                                class="dynamic-bar"
                                style="height:${height}%">
                            </div>

                            <div class="dynamic-bar-label">
                                ${escapeHTML(
                                    shortenVisualLabel(label)
                                )}
                            </div>

                        </div>
                    `;
                }
            ).join("")}
        </div>
    `;


    if (barChartTitle) {
        barChartTitle.textContent =
            `${category} vs ${metric}`;
    }


    if (barChartDescription) {
        barChartDescription.textContent =
            `FINEXA compares ${metric.toLowerCase()} across ${category.toLowerCase()} values.`;
    }


    if (barChartXAxis) {
        barChartXAxis.textContent =
            category;
    }


    if (barChartYAxis) {
        barChartYAxis.textContent =
            metric;
    }


    if (barChartField) {
        barChartField.textContent =
            `${category} × ${metric}`;
    }
}


/* =========================================================
   LINE CHART
========================================================= */

function buildDynamicLineChart(
    analysis,
    rows
) {

    if (!dynamicLineChart) {
        return;
    }
    const date =
        analysis.date;

    const metric =
        analysis.metric;


    if (!date || !metric) {

        dynamicLineChart.innerHTML =`
            <div class="visual-chart-loading">
                <p>
                    No compatible time field was found for a trend chart.
                </p>
            </div>
        `;

        if (lineChartTitle) {
            lineChartTitle.textContent =
                "Trend Analysis";
        }

        if (lineChartDescription) {
            lineChartDescription.textContent =
                "A time-based trend cannot be generated because the dataset has no compatible time field.";
        }

        return;
    }


    const grouped = {};


    rows.forEach(row => {

        const dateValue =
            getRowValue(row, date);

        const metricValue =
            toNumber(
                getRowValue(row, metric)
            );


        if (
            dateValue === null ||
            dateValue === undefined ||
            dateValue === "" ||
            metricValue === null
        ) {
            return;
        }


        const parsedDate =
            new Date(dateValue);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return;
        }


        const key =
            parsedDate
                .toISOString()
                .slice(0, 10);


        if (!grouped[key]) {
            grouped[key] = 0;
        }


        grouped[key] += metricValue;
    });


    const entries =
        Object.entries(grouped)
            .sort(
                (a, b) =>
                    new Date(a[0]) -
                    new Date(b[0])
            );


    if (entries.length < 2) {

        dynamicLineChart.innerHTML =` 
            <div class="visual-chart-loading">
                <p>
                    Not enough time-based values were found for a trend.
                </p>
            </div>
        `;

        return;
    }


    createVisualLineChart(
        entries,
        metric
    );


    if (lineChartTitle) {
        lineChartTitle.textContent =
            `${metric} Trend`;
    }


    if (lineChartDescription) {
        lineChartDescription.textContent =
            `FINEXA tracks how ${metric.toLowerCase()} changes across the available time periods.`;
    }


    if (lineChartXAxis) {
        lineChartXAxis.textContent =
            date;
    }


    if (lineChartYAxis) {
        lineChartYAxis.textContent =
            metric;
    }


    if (lineChartField) {
        lineChartField.textContent =
            `${date} × ${metric}`;
    }
}



        /* =========================================================
   SVG LINE CHART
========================================================= */

function createVisualLineChart(
    entries,
    metric
) {

    const width = 760;
    const height = 300;

    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 45;

    const chartWidth =
        width -
        paddingLeft -
        paddingRight;

    const chartHeight =
        height -
        paddingTop -
        paddingBottom;

    const values =
        entries.map(entry => entry[1]);

    const minValue =
        Math.min(...values);

    const maxValue =
        Math.max(...values);

    const range =
        maxValue - minValue || 1;

    const points =
        entries.map(
            ([date, value], index) => {

                const x =
                    paddingLeft +
                    (
                        index /
                        Math.max(
                            entries.length - 1,
                            1
                        )
                    ) *
                    chartWidth;

                const y =
                    paddingTop +
                    chartHeight -
                    (
                        (
                            value -
                            minValue
                        ) /
                        range
                    ) *
                    chartHeight;

                return {
                    date,
                    value,
                    x,
                    y
                };
            }
        );

    const linePath =
        points
            .map(
                (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
            )
            .join(" ");

    const areaPath =
        `${linePath}
         L ${points[points.length - 1].x}
         ${paddingTop + chartHeight}
         L ${points[0].x}
         ${paddingTop + chartHeight}
         Z`;

    const labelStep =
        Math.max(
            1,
            Math.ceil(
                points.length / 6
            )
        );

    dynamicLineChart.innerHTML = `
        <div
            class="visual-svg-line-wrapper"
            style="
                width:100%;
                height:100%;
                overflow:hidden;
            ">

            <svg
                viewBox="0 0 ${width} ${height}"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                aria-label="${escapeHTML(metric)} trend chart">

                <!-- GRID -->

                <line
                    x1="${paddingLeft}"
                    y1="${paddingTop}"
                    x2="${paddingLeft}"
                    y2="${paddingTop + chartHeight}">
                </line>

                <line
                    x1="${paddingLeft}"
                    y1="${paddingTop + chartHeight}"
                    x2="${width - paddingRight}"
                    y2="${paddingTop + chartHeight}">
                </line>

                <line
                    x1="${paddingLeft}"
                    y1="${paddingTop + chartHeight * 0.5}"
                    x2="${width - paddingRight}"
                    y2="${paddingTop + chartHeight * 0.5}">
                </line>


                <!-- AREA -->

                <path
                    d="${areaPath}"
                    fill="rgba(124, 92, 255, 0.08)"
                    stroke="none">
                </path>


                <!-- LINE -->

                <path
                    d="${linePath}"
                    fill="none"
                    stroke="#7c5cff"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                </path>


                <!-- POINTS -->
                ${points.map(point =>`
                    <circle
                        cx="${point.x}"
                        cy="${point.y}"
                        r="5"
                        fill="#101018"
                        stroke="#9c91ff"
                        stroke-width="3">
                    </circle>
                `).join("")}


                <!-- DATE LABELS -->

                ${points.map((point, index) => {

                    if (
                        index % labelStep !== 0 &&
                        index !== points.length - 1
                    ) {
                        return "";
                    }

                    const dateLabel =
                        formatChartDate(
                            point.date
                        );

                    return`
                        <text
                            x="${point.x}"
                            y="${height - 14}"
                            text-anchor="middle"
                            font-size="10">

                            ${escapeHTML(dateLabel)}

                        </text>
                    `;

                }).join("")}


                <!-- MAX VALUE -->

                <text
                    x="${paddingLeft}"
                    y="${paddingTop - 8}"
                    text-anchor="start"
                    font-size="10">

                    ${escapeHTML(
                        formatVisualNumber(maxValue)
                    )}

                </text>

            </svg>

        </div>
    `;
}


/* =========================================================
   VISUAL SUMMARY
========================================================= */

function updateVisualSummary(
    analysis
) {

    if (visualCategoryField) {

        visualCategoryField.textContent =
            analysis.category ||
            "Not detected";
    }


    if (visualMetricField) {

        visualMetricField.textContent =
            analysis.metric ||
            "Not detected";
    }


    if (visualTimeField) {

        visualTimeField.textContent =
            analysis.date ||
            "Not detected";
    }


    if (visualStatusField) {

        const hasBar =
            Boolean(
                analysis.category &&
                analysis.metric
            );

        const hasLine =
            Boolean(
                analysis.date &&
                analysis.metric
            );


        if (hasBar && hasLine) {

            visualStatusField.textContent =
                "Live";

        } else if (hasBar || hasLine) {

            visualStatusField.textContent =
                "Partial";

        } else {

            visualStatusField.textContent =
                "Unavailable";
        }
    }


    if (visualNoDataState) {

        visualNoDataState.style.display =
            "none";
    }
}


/* =========================================================
   ROW VALUE HELPER
========================================================= */

function getRowValue(
    row,
    column
) {

    if (!row) {
        return null;
    }


    if (
        Object.prototype.hasOwnProperty.call(
            row,
            column
        )
    ) {
        return row[column];
    }


    const lowerColumn =
        String(column).toLowerCase();


    const key =
        Object.keys(row).find(
            item =>
                String(item).toLowerCase() ===
                lowerColumn
        );


    return key !== undefined
        ? row[key]
        : null;
}


/* =========================================================
   NUMBER HELPERS
========================================================= */

function isNumericValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return false;
    }


    if (typeof value === "number") {

        return Number.isFinite(value);
    }


    const cleaned =
        String(value)
            .replace(/,/g, "")
            .replace(/[₹$€£%]/g, "")
            .trim();
            return (
        cleaned !== "" &&
        Number.isFinite(
            Number(cleaned)
        )
    );
}


function toNumber(value) {

    if (!isNumericValue(value)) {
        return null;
    }


    const cleaned =
        String(value)
            .replace(/,/g, "")
            .replace(/[₹$€£%]/g, "")
            .trim();


    const number =
        Number(cleaned);


    return Number.isFinite(number)
        ? number
        : null;
}


/* =========================================================
   DATE HELPERS
========================================================= */

function isDateValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return false;
    }


    if (value instanceof Date) {

        return !Number.isNaN(
            value.getTime()
        );
    }


    const text =
        String(value).trim();


    if (
        /^\d{4}$/.test(text)
    ) {
        return true;
    }


    if (
        /^\d{4}[-/]\d{1,2}([-/]\d{1,2})?$/.test(text)
    ) {
        return true;
    }


    if (
        /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/.test(text)
    ) {
        return true;
    }


    const parsed =
        new Date(text);


    return (
        !Number.isNaN(
            parsed.getTime()
        ) &&
        /[-/:]/.test(text)
    );
}


/* =========================================================
   FORMATTING
========================================================= */

function formatVisualNumber(
    value
) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "—";
    }


    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
}


function formatChartDate(
    value
) {

    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );
}


function shortenVisualLabel(
    value
) {

    const text =
        String(value);


    if (text.length <= 13) {
        return text;
    }


    return (
        text.substring(0, 11) +
        "…"
    );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function showVisualNoData() {

    if (dynamicBarChart) {

        dynamicBarChart.innerHTML =` 
            <div class="visual-chart-loading">

                <p>
                    Visualization unavailable for this dataset.
                </p>

            </div>
        `;
    }


    if (dynamicLineChart) {

        dynamicLineChart.innerHTML =`
            <div class="visual-chart-loading">

                <p>
                    Visualization unavailable for this dataset.
                </p>

            </div>
        `;
    }


    if (visualCategoryField) {

        visualCategoryField.textContent =
            "Not detected";
    }


    if (visualMetricField) {

        visualMetricField.textContent =
            "Not detected";
    }


    if (visualTimeField) {

        visualTimeField.textContent =
            "Not detected";
    }


    if (visualStatusField) {

        visualStatusField.textContent =
            "Unavailable";
    }


    if (visualNoDataState) {

        visualNoDataState.style.display =
            "block";
    }
}


/* =========================================================
   START PART 5
========================================================= */

loadVisualAnalytics();
/* =========================================================
   PART 6 — DATA EXPLORER
========================================================= */

const explorerSearch =
    document.getElementById("explorerSearch");

const explorerReset =
    document.getElementById("explorerReset");

const explorerTableWrapper =
    document.getElementById("explorerTableWrapper");

const explorerTotalRows =
    document.getElementById("explorerTotalRows");

const explorerTotalColumns =
    document.getElementById("explorerTotalColumns");

const explorerShowingRows =
    document.getElementById("explorerShowingRows");

const explorerStatus =
    document.getElementById("explorerStatus");

const explorerPagination =
    document.getElementById("explorerPagination");

const explorerPrev =
    document.getElementById("explorerPrev");

const explorerNext =
    document.getElementById("explorerNext");

const explorerCurrentPage =
    document.getElementById("explorerCurrentPage");

const explorerTotalPages =
    document.getElementById("explorerTotalPages");

const explorerEmptyState =
    document.getElementById("explorerEmptyState");


let explorerColumns = [];
let explorerRows = [];
let explorerFilteredRows = [];

let explorerCurrentPageNumber = 1;

const explorerRowsPerPage = 10;


/* =========================================================
   LOCAL NUMBER FORMATTER
   Self-contained — does not depend on Part 1
========================================================= */

function formatExplorerNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadDataExplorer() {

    if (!explorerTableWrapper) {
        return;
    }

    try {

        if (explorerStatus) {
            explorerStatus.textContent = "Loading";
        }

        const response =
            await fetch("/api/data");

        if (!response.ok) {

            throw new Error(
                "Dataset could not be loaded."
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            data.success === false
        ) {

            throw new Error(
                data?.error ||
                "No dataset available."
            );
        }


        explorerColumns =
            Array.isArray(data.columns)
                ? data.columns
                : [];


        explorerRows =
            Array.isArray(data.rows)
                ? data.rows
                : [];


        explorerFilteredRows =
            [...explorerRows];


        explorerCurrentPageNumber = 1;


        updateExplorerMeta();

        renderExplorerTable();

        updateExplorerPagination();


        if (explorerStatus) {
            explorerStatus.textContent = "Live";
        }


    } catch (error) {

        console.error(
            "FINEXA Data Explorer:",
            error
        );

        showExplorerError();
    }
}


/* =========================================================
   UPDATE META
========================================================= */

function updateExplorerMeta() {

    if (explorerTotalRows) {

        explorerTotalRows.textContent =
            formatExplorerNumber(
                explorerRows.length
            );
    }


    if (explorerTotalColumns) {

        explorerTotalColumns.textContent =
            formatExplorerNumber(
                explorerColumns.length
            );
    }


    if (explorerShowingRows) {

        explorerShowingRows.textContent =
            formatExplorerNumber(
                Math.min(
                    explorerFilteredRows.length,
                    explorerRowsPerPage
                )
            );
    }
}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderExplorerTable() {
if (!explorerTableWrapper) {
        return;
    }


    if (
        !explorerColumns.length ||
        !explorerFilteredRows.length
    ) {

        explorerTableWrapper.innerHTML = "";


        if (explorerEmptyState) {
            explorerEmptyState.style.display = "block";
        }


        if (explorerShowingRows) {
            explorerShowingRows.textContent = "0";
        }

        return;
    }


    if (explorerEmptyState) {
        explorerEmptyState.style.display = "none";
    }


    const startIndex =
        (
            explorerCurrentPageNumber -
            1
        ) *
        explorerRowsPerPage;


    const endIndex =
        startIndex +
        explorerRowsPerPage;


    const visibleRows =
        explorerFilteredRows.slice(
            startIndex,
            endIndex
        );


    const table =
        document.createElement("table");

    table.className =
        "explorer-data-table";


    /* =====================================================
       HEADER
    ===================================================== */

    const thead =
        document.createElement("thead");

    const headerRow =
        document.createElement("tr");


    const numberHeader =
        document.createElement("th");

    numberHeader.textContent = "#";

    headerRow.appendChild(
        numberHeader
    );


    explorerColumns.forEach(
        column => {

            const th =
                document.createElement("th");

            th.textContent =
                String(column);

            headerRow.appendChild(th);

        }
    );


    thead.appendChild(headerRow);


    /* =====================================================
       BODY
    ===================================================== */

    const tbody =
        document.createElement("tbody");


    visibleRows.forEach(
        (row, rowIndex) => {

            const tr =
                document.createElement("tr");


            /* Row number */

            const numberCell =
                document.createElement("td");

            numberCell.textContent =
                String(
                    startIndex +
                    rowIndex +
                    1
                );

            tr.appendChild(numberCell);


            /* Data cells */

            explorerColumns.forEach(
                column => {

                    const td =
                        document.createElement("td");


                    const value =
                        getRowValue(
                            row,
                            column
                        );


                    const formattedValue =
                        formatExplorerValue(
                            value
                        );


                    td.textContent =
                        formattedValue;

                    td.title =
                        formattedValue;


                    tr.appendChild(td);

                }
            );


            tbody.appendChild(tr);

        }
    );


    table.appendChild(thead);
    table.appendChild(tbody);


    explorerTableWrapper.innerHTML = "";

    explorerTableWrapper.appendChild(
        table
    );


    if (explorerShowingRows) {

        explorerShowingRows.textContent =
            formatExplorerNumber(
                visibleRows.length
            );
    }
}


/* =========================================================
   SEARCH
========================================================= */

function searchExplorerData() {

    const query =
        explorerSearch
            ? explorerSearch.value
                .trim()
                .toLowerCase()
            : "";


    if (!query) {

        explorerFilteredRows =
            [...explorerRows];

    } else {

        explorerFilteredRows =
            explorerRows.filter(
                row => {

                    return explorerColumns.some(
                        column => {
                        const value =
                                getRowValue(
                                    row,
                                    column
                                );


                            return String(
                                value ?? ""
                            )
                                .toLowerCase()
                                .includes(query);

                        }
                    );

                }
            );
    }


    explorerCurrentPageNumber = 1;


    renderExplorerTable();

    updateExplorerPagination();


    if (explorerStatus) {

        explorerStatus.textContent =
            query
                ? `${explorerFilteredRows.length} Match${
                    explorerFilteredRows.length === 1
                        ? ""
                        : "es"
                  }`
                : "Live";
    }
}


/* =========================================================
   RESET
========================================================= */

function resetExplorer() {

    if (explorerSearch) {
        explorerSearch.value = "";
    }


    explorerFilteredRows =
        [...explorerRows];


    explorerCurrentPageNumber = 1;


    renderExplorerTable();

    updateExplorerPagination();


    if (explorerStatus) {
        explorerStatus.textContent = "Live";
    }
}


/* =========================================================
   PAGINATION
========================================================= */

function updateExplorerPagination() {

    if (!explorerPagination) {
        return;
    }


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                explorerFilteredRows.length /
                explorerRowsPerPage
            )
        );


    if (
        explorerCurrentPageNumber >
        totalPages
    ) {

        explorerCurrentPageNumber =
            totalPages;
    }


    if (explorerCurrentPage) {

        explorerCurrentPage.textContent =
            String(
                explorerCurrentPageNumber
            );
    }


    if (explorerTotalPages) {

        explorerTotalPages.textContent =
            String(totalPages);
    }


    if (explorerPrev) {

        explorerPrev.disabled =
            explorerCurrentPageNumber <= 1;
    }


    if (explorerNext) {

        explorerNext.disabled =
            explorerCurrentPageNumber >=
            totalPages;
    }


    explorerPagination.style.display =
        explorerFilteredRows.length >
        explorerRowsPerPage
            ? "flex"
            : "none";
}


/* =========================================================
   PREVIOUS
========================================================= */

function explorerPreviousPage() {

    if (
        explorerCurrentPageNumber <= 1
    ) {
        return;
    }


    explorerCurrentPageNumber--;


    renderExplorerTable();

    updateExplorerPagination();
}


/* =========================================================
   NEXT
========================================================= */

function explorerNextPage() {

    const totalPages =
        Math.ceil(
            explorerFilteredRows.length /
            explorerRowsPerPage
        );


    if (
        explorerCurrentPageNumber >=
        totalPages
    ) {
        return;
    }


    explorerCurrentPageNumber++;


    renderExplorerTable();

    updateExplorerPagination();
}


/* =========================================================
   VALUE FORMATTER
========================================================= */

function formatExplorerValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }


    if (
        typeof value === "number"
    ) {

        return value.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
    }


    const text =
        String(value);


    if (!text.trim()) {
        return "—";
    }


    return text;
}
/* =========================================================
   ERROR STATE
========================================================= */

function showExplorerError() {

    if (explorerTableWrapper) {

        explorerTableWrapper.innerHTML =`
            <div class="explorer-loading">
                <p>
                    FINEXA could not load the dataset.
                </p>
            </div>
        `;
    }


    if (explorerTotalRows) {
        explorerTotalRows.textContent = "0";
    }


    if (explorerTotalColumns) {
        explorerTotalColumns.textContent = "0";
    }


    if (explorerShowingRows) {
        explorerShowingRows.textContent = "0";
    }


    if (explorerStatus) {
        explorerStatus.textContent = "Unavailable";
    }


    if (explorerPagination) {
        explorerPagination.style.display = "none";
    }
}


/* =========================================================
   EVENTS
========================================================= */

if (explorerSearch) {

    explorerSearch.addEventListener(
        "input",
        searchExplorerData
    );
}


if (explorerReset) {

    explorerReset.addEventListener(
        "click",
        resetExplorer
    );
}


if (explorerPrev) {

    explorerPrev.addEventListener(
        "click",
        explorerPreviousPage
    );
}


if (explorerNext) {

    explorerNext.addEventListener(
        "click",
        explorerNextPage
    );
}


/* =========================================================
   START DATA EXPLORER
========================================================= */

loadDataExplorer();
/* =========================================================
   PART 7 — SCHEMA + DATA COMPOSITION
========================================================= */

const schemaTableWrapper =
    document.getElementById("schemaTableWrapper");

const schemaColumnCount =
    document.getElementById("schemaColumnCount");

const schemaNumericCount =
    document.getElementById("schemaNumericCount");

const schemaTextCount =
    document.getElementById("schemaTextCount");

const schemaDateCount =
    document.getElementById("schemaDateCount");

const compositionChartWrapper =
    document.getElementById("compositionChartWrapper");

const compositionLegend =
    document.getElementById("compositionLegend");

const compositionTitle =
    document.getElementById("compositionTitle");

const compositionField =
    document.getElementById("compositionField");

const schemaEmptyState =
    document.getElementById("schemaEmptyState");


let schemaColumns = [];
let schemaRows = [];


/* =========================================================
   LOAD SCHEMA DATA
========================================================= */

async function loadSchemaAnalysis() {

    try {

        const response =
            await fetch("/api/data");

        if (!response.ok) {

            throw new Error(
                "Schema data could not be loaded."
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(
                data?.error ||
                "No dataset available."
            );
        }


        schemaColumns =
            Array.isArray(data.columns)
                ? data.columns
                : [];


        schemaRows =
            Array.isArray(data.rows)
                ? data.rows
                : [];


        if (
            !schemaColumns.length ||
            !schemaRows.length
        ) {

            showSchemaEmptyState();

            return;
        }


        buildSchemaOverview();

        buildSchemaTable();

        buildCompositionChart();


    } catch (error) {

        console.error(
            "FINEXA Schema:",
            error
        );

        showSchemaEmptyState();
    }
}


/* =========================================================
   SCHEMA OVERVIEW
========================================================= */

function buildSchemaOverview() {

    const numericColumns =
        schemaColumns.filter(
            column =>
                detectSchemaType(column) ===
                "Number"
        );


    const dateColumns =
        schemaColumns.filter(
            column =>
                detectSchemaType(column) ===
                "Date"
        );


    const textColumns =
        schemaColumns.filter(
            column =>
                detectSchemaType(column) ===
                "Text"
        );


    if (schemaColumnCount) {

        schemaColumnCount.textContent =
            schemaColumns.length.toLocaleString(
                "en-IN"
            );
    }


    if (schemaNumericCount) {

        schemaNumericCount.textContent =
            numericColumns.length.toLocaleString(
                "en-IN"
            );
    }


    if (schemaTextCount) {

        schemaTextCount.textContent =
            textColumns.length.toLocaleString(
                "en-IN"
            );
    }


    if (schemaDateCount) {

        schemaDateCount.textContent =
            dateColumns.length.toLocaleString(
                "en-IN"
            );
    }
}


/* =========================================================
   TYPE DETECTION
========================================================= */

function detectSchemaType(column) {

    const values =
        schemaRows
        .map(
                row =>
                    getSchemaRowValue(
                        row,
                        column
                    )
            )
            .filter(
                value =>
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
            );


    if (!values.length) {

        return "Text";
    }


    const numericCount =
        values.filter(
            value =>
                isSchemaNumeric(value)
        ).length;


    const dateCount =
        values.filter(
            value =>
                isSchemaDate(value)
        ).length;


    const booleanCount =
        values.filter(
            value =>
                isSchemaBoolean(value)
        ).length;


    const total =
        values.length;


    if (
        booleanCount / total >=
        0.8
    ) {

        return "Boolean";
    }


    if (
        dateCount / total >=
        0.8
    ) {

        return "Date";
    }


    if (
        numericCount / total >=
        0.8
    ) {

        return "Number";
    }


    return "Text";
}


/* =========================================================
   NUMERIC DETECTION
========================================================= */

function isSchemaNumeric(value) {

    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {

        return true;
    }


    const text =
        String(value)
            .replace(/,/g, "")
            .replace(/[₹$€£%]/g, "")
            .trim();


    if (!text) {
        return false;
    }


    return Number.isFinite(
        Number(text)
    );
}


/* =========================================================
   BOOLEAN DETECTION
========================================================= */

function isSchemaBoolean(value) {

    const text =
        String(value)
            .trim()
            .toLowerCase();


    return (
        text === "true" ||
        text === "false" ||
        text === "yes" ||
        text === "no"
    );
}


/* =========================================================
   DATE DETECTION
========================================================= */

function isSchemaDate(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return false;
    }


    if (
        value instanceof Date
    ) {

        return !Number.isNaN(
            value.getTime()
        );
    }


    const text =
        String(value).trim();


    if (
        /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/
            .test(text)
    ) {

        return true;
    }


    if (
        /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/
            .test(text)
    ) {

        return true;
    }


    if (
        /^\d{4}[-/]\d{1,2}$/
            .test(text)
    ) {

        return true;
    }


    const parsed =
        new Date(text);


    return (
        !Number.isNaN(
            parsed.getTime()
        ) &&
        /[-/:]/.test(text)
    );
}


/* =========================================================
   ROW VALUE
========================================================= */

function getSchemaRowValue(
    row,
    column
) {

    if (!row) {
        return null;
    }


    if (
        Object.prototype.hasOwnProperty.call(
            row,
            column
        )
    ) {

        return row[column];
    }


    const target =
        String(column).toLowerCase();


    const key =
        Object.keys(row).find(
            item =>
                String(item).toLowerCase() ===
                target
        );


    if (
        key !== undefined
    ) {

        return row[key];
    }


    return null;
}


/* =========================================================
   SCHEMA TABLE
========================================================= */

function buildSchemaTable() {

    if (!schemaTableWrapper) {
        return;
    }


    const table =
        document.createElement("table");

    table.className =
        "schema-data-table";
        const thead =
        document.createElement("thead");


    const headerRow =
        document.createElement("tr");


    const headers = [
        "Column",
        "Type",
        "Non-Null",
        "Missing",
        "Unique",
        "Completeness"
    ];


    headers.forEach(
        title => {

            const th =
                document.createElement("th");

            th.textContent =
                title;

            headerRow.appendChild(th);
        }
    );


    thead.appendChild(
        headerRow
    );


    const tbody =
        document.createElement("tbody");


    schemaColumns.forEach(
        column => {

            const values =
                schemaRows.map(
                    row =>
                        getSchemaRowValue(
                            row,
                            column
                        )
                );


            const nonNullValues =
                values.filter(
                    value =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                );


            const missingCount =
                values.length -
                nonNullValues.length;


            const uniqueValues =
                new Set(
                    nonNullValues.map(
                        value =>
                            String(value)
                    )
                ).size;


            const completeness =
                values.length
                    ? (
                        nonNullValues.length /
                        values.length
                      ) * 100
                    : 0;


            const type =
                detectSchemaType(
                    column
                );


            const tr =
                document.createElement("tr");


            /* Column */

            const columnCell =
                document.createElement("td");

            columnCell.textContent =
                String(column);


            /* Type */

            const typeCell =
                document.createElement("td");


            const typeBadge =
                document.createElement("span");

            typeBadge.className =
                "schema-type-badge";

            typeBadge.textContent =
                type;


            typeCell.appendChild(
                typeBadge
            );


            /* Non-null */

            const nonNullCell =
                document.createElement("td");

            nonNullCell.textContent =
                nonNullValues.length.toLocaleString(
                    "en-IN"
                );


            /* Missing */

            const missingCell =
                document.createElement("td");

            missingCell.textContent =
                missingCount.toLocaleString(
                    "en-IN"
                );


            /* Unique */

            const uniqueCell =
                document.createElement("td");

            uniqueCell.textContent =
                uniqueValues.toLocaleString(
                    "en-IN"
                );


            /* Completeness */

            const completenessCell =
                document.createElement("td");


            const completenessBox =
                document.createElement("div");

            completenessBox.className =
                "schema-completeness";


            const completenessBar =
                document.createElement("div");

            completenessBar.className =
                "schema-completeness-bar";


            const completenessFill =
                document.createElement("div");

            completenessFill.className =
                "schema-completeness-fill";


            completenessFill.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        completeness,
                        100
                    )
                )}%`;
                const completenessText =
                document.createElement("span");

            completenessText.textContent =
                `${completeness.toFixed(0)}%`;


            completenessBar.appendChild(
                completenessFill
            );


            completenessBox.appendChild(
                completenessBar
            );


            completenessBox.appendChild(
                completenessText
            );


            completenessCell.appendChild(
                completenessBox
            );


            tr.appendChild(columnCell);
            tr.appendChild(typeCell);
            tr.appendChild(nonNullCell);
            tr.appendChild(missingCell);
            tr.appendChild(uniqueCell);
            tr.appendChild(completenessCell);


            tbody.appendChild(tr);
        }
    );


    table.appendChild(thead);
    table.appendChild(tbody);


    schemaTableWrapper.innerHTML = "";

    schemaTableWrapper.appendChild(
        table
    );
}


/* =========================================================
   FIND CATEGORICAL FIELD
========================================================= */

function findCompositionColumn() {

    const candidates =
        schemaColumns.filter(
            column =>
                detectSchemaType(column) ===
                "Text"
        );


    if (!candidates.length) {
        return null;
    }


    let bestColumn = null;
    let bestScore = -Infinity;


    candidates.forEach(
        column => {

            const values =
                schemaRows
                    .map(
                        row =>
                            getSchemaRowValue(
                                row,
                                column
                            )
                    )
                    .filter(
                        value =>
                            value !== null &&
                            value !== undefined &&
                            String(value).trim() !== ""
                    )
                    .map(
                        value =>
                            String(value)
                    );


            if (!values.length) {
                return;
            }


            const uniqueCount =
                new Set(values).size;


            const uniqueRatio =
                uniqueCount /
                values.length;


            /*
             * Good categorical fields usually have
             * repeated values but more than one category.
             */

            if (
                uniqueCount < 2 ||
                uniqueCount > 12
            ) {

                return;
            }


            const score =
                (
                    1 -
                    Math.abs(
                        uniqueRatio -
                        0.25
                    )
                ) +
                Math.min(
                    uniqueCount / 20,
                    0.5
                );


            if (
                score >
                bestScore
            ) {

                bestScore =
                    score;

                bestColumn =
                    column;
            }
        }
    );


    return bestColumn;
}


/* =========================================================
   BUILD DONUT
========================================================= */

function buildCompositionChart() {

    if (!compositionChartWrapper) {
        return;
    }


    const column =
        findCompositionColumn();


    if (!column) {

        showCompositionUnavailable();

        return;
    }


    const counts = {};


    schemaRows.forEach(
        row => {

            const value =
                getSchemaRowValue(
                    row,
                    column
                );


            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {

                return;
            }


            const key =
                String(value);
                counts[key] =
                (counts[key] || 0) +
                1;
        }
    );


    let entries =
        Object.entries(counts)
            .sort(
                (a, b) =>
                    b[1] -
                    a[1]
            );


    if (!entries.length) {

        showCompositionUnavailable();

        return;
    }


    /*
     * Keep the donut readable.
     * Small remaining categories are grouped
     * into "Other".
     */

    if (entries.length > 6) {

        const top =
            entries.slice(0, 5);

        const otherTotal =
            entries
                .slice(5)
                .reduce(
                    (sum, item) =>
                        sum + item[1],
                    0
                );


        if (otherTotal > 0) {

            top.push([
                "Other",
                otherTotal
            ]);
        }


        entries = top;
    }


    const total =
        entries.reduce(
            (sum, item) =>
                sum + item[1],
            0
        );


    const radius = 82;

    const circumference =
        2 *
        Math.PI *
        radius;


    const segmentColors = [
        "#8f82ff",
        "#63b3ff",
        "#7dffb2",
        "#ffca70",
        "#ff7eb6",
        "#a7a7b8"
    ];


    let offset = 0;


    const segments =
        entries.map(
            ([label, value], index) => {

                const percentage =
                    value /
                    total;


                const length =
                    percentage *
                    circumference;


                const segment = {
                    label,
                    value,
                    percentage,
                    length,
                    offset,
                    color:
                        segmentColors[
                            index %
                            segmentColors.length
                        ]
                };


                offset += length;

                return segment;
            }
        );


    if (compositionTitle) {

        compositionTitle.textContent =
            `${column} Distribution`;
    }


    if (compositionField) {

        compositionField.textContent =
            String(column);
    }


    const svgSegments =
        segments.map(
            segment => {

                return` 
                    <circle
                        class="composition-donut-segment"
                        cx="115"
                        cy="115"
                        r="${radius}"
                        stroke="${segment.color}"
                        stroke-dasharray="
                            ${segment.length}
                            ${circumference - segment.length}
                        "
                        stroke-dashoffset="${-segment.offset}"
                    ></circle>
                `;
            }
        ).join("");


    compositionChartWrapper.innerHTML =` 
        <div class="composition-donut">

            <svg
                viewBox="0 0 230 230"
                aria-label="${escapeHTML(
                    column
                )} distribution chart">

                <circle
                    class="composition-donut-track"
                    cx="115"
                    cy="115"
                    r="${radius}">
                </circle>

                ${svgSegments}

            </svg>


            <div class="composition-donut-center">

                <strong>
                    ${total.toLocaleString("en-IN")}
                </strong>

                <span>
                    TOTAL
                </span>

            </div>

        </div>
    `;


    buildCompositionLegend(
        segments
    );
}


/* =========================================================
   PART 7 — LEGEND
========================================================= */

function buildCompositionLegend(
    segments
) {

    if (!compositionLegend) {
        return;
    }


    compositionLegend.innerHTML = "";


    segments.forEach(
        segment => {

            const item =
                document.createElement("div");

            item.className =
                "composition-legend-item";


            const dot =
                document.createElement("span");

            dot.className =
                "composition-legend-dot";

            dot.style.background =
                segment.color;


            const text =
                document.createElement("div");

            text.className =
                "composition-legend-text";


            const name =
                document.createElement("strong");

            name.textContent =
                shortenSchemaLabel(
                    segment.label
                );


            const percentage =
                document.createElement("span");

            percentage.textContent =
                `${(
                    segment.percentage *
                    100
                ).toFixed(1)}% • ${
                    segment.value
                }`;


            text.appendChild(name);
            text.appendChild(percentage);


            item.appendChild(dot);
            item.appendChild(text);


            compositionLegend.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   SHORT LABEL
========================================================= */

function shortenSchemaLabel(
    value
) {

    const text =
        String(value);


    if (text.length <= 18) {
        return text;
    }


    return (
        text.substring(0, 16) +
        "…"
    );
}


/* =========================================================
   COMPOSITION UNAVAILABLE
========================================================= */

function showCompositionUnavailable() {

    if (compositionChartWrapper) {

        compositionChartWrapper.innerHTML =`
            <div class="composition-loading">

                <div class="composition-loading-ring"></div>

                <p>
                    No suitable categorical field
                    was found for a composition chart.
                </p>

            </div>
        `;
    }


    if (compositionLegend) {
        compositionLegend.innerHTML = "";
    }


    if (compositionField) {
        compositionField.textContent =
            "Not detected";
    }


    if (compositionTitle) {
        compositionTitle.textContent =
            "Value Distribution";
    }
}


/* =========================================================
   EMPTY SCHEMA
========================================================= */

function showSchemaEmptyState() {

    if (schemaTableWrapper) {
        schemaTableWrapper.innerHTML = "";
    }


    if (schemaEmptyState) {
        schemaEmptyState.style.display =
            "block";
    }


    if (schemaColumnCount) {
        schemaColumnCount.textContent =
            "0";
    }


    if (schemaNumericCount) {
        schemaNumericCount.textContent =
            "0";
    }


    if (schemaTextCount) {
        schemaTextCount.textContent =
            "0";
    }


    if (schemaDateCount) {
        schemaDateCount.textContent =
            "0";
    }


    showCompositionUnavailable();
}


/* =========================================================
   START PART 7
========================================================= */

loadSchemaAnalysis();
/* =========================================================
   PART 8 — AI ANALYST + FINEXA CHATBOT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const aiFindingsList =
    document.getElementById("aiFindingsList");

const aiRecommendationsList =
    document.getElementById("aiRecommendationsList");

const aiAnalysisStatus =
    document.getElementById("aiAnalysisStatus");

const finexaChatMessages =
    document.getElementById("finexaChatMessages");

const finexaChatInput =
    document.getElementById("finexaChatInput");

const finexaChatSend =
    document.getElementById("finexaChatSend");

const finexaSuggestions =
    document.getElementById("finexaSuggestions");


/* =========================================================
   FINEXA DATA
========================================================= */

let finexaAnalysisData = null;

let finexaColumns = [];

let finexaRows = [];


/* =========================================================
   SAFE NUMBER
========================================================= */

function finexaToNumber(value) {

    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {
        return value;
    }


    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }


    const text =
        String(value)
            .replace(/,/g, "")
            .replace(/[₹$€£%]/g, "")
            .trim();


    if (!text) {
        return null;
    }


    const number =
        Number(text);


    return Number.isFinite(number)
        ? number
        : null;
}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function finexaFormatNumber(value) {

    const number =
        finexaToNumber(value);


    if (
        number === null
    ) {
        return "—";
    }


    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   GET ROW VALUE
========================================================= */

function getFinexaRowValue(
    row,
    column
) {

    if (!row) {
        return null;
    }


    if (
        Object.prototype.hasOwnProperty.call(
            row,
            column
        )
    ) {
        return row[column];
    }


    const target =
        String(column).toLowerCase();


    const key =
        Object.keys(row).find(
            item =>
                String(item).toLowerCase() ===
                target
        );


    return key !== undefined
        ? row[key]
        : null;
}


/* =========================================================
   DETECT NUMERIC COLUMNS
========================================================= */

function getFinexaNumericColumns() {

    return finexaColumns.filter(
        column => {

            const values =
                finexaRows
                    .map(
                        row =>
                            getFinexaRowValue(
                                row,
                                column
                            )
                    )
                    .filter(
                        value =>
                            value !== null &&
                            value !== undefined &&
                            String(value).trim() !== ""
                    );


            if (!values.length) {
                return false;
            }


            const numericValues =
                values.filter(
                    value =>
                        finexaToNumber(value) !== null
                );


            return (
                numericValues.length /
                values.length
            ) >= 0.8;
        }
    );
}
/* =========================================================
   FIND COLUMN BY KEYWORD
========================================================= */

function findFinexaColumnByKeywords(
    keywords
) {

    const numericColumns =
        getFinexaNumericColumns();


    let bestColumn = null;

    let bestScore = -Infinity;


    numericColumns.forEach(
        column => {

            const text =
                String(column)
                    .toLowerCase();


            let score = 0;


            keywords.forEach(
                keyword => {

                    if (
                        text === keyword
                    ) {
                        score += 10;
                    }
                    else if (
                        text.includes(keyword)
                    ) {
                        score += 5;
                    }
                }
            );


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                bestColumn =
                    column;
            }
        }
    );


    return bestScore > 0
        ? bestColumn
        : null;
}


/* =========================================================
   CALCULATE AVERAGE
========================================================= */

function calculateFinexaAverage(
    column
) {

    if (!column) {
        return null;
    }


    const values =
        finexaRows
            .map(
                row =>
                    finexaToNumber(
                        getFinexaRowValue(
                            row,
                            column
                        )
                    )
            )
            .filter(
                value =>
                    value !== null
            );


    if (!values.length) {
        return null;
    }


    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    return {
        column,
        count: values.length,
        average: total / values.length
    };
}


/* =========================================================
   CALCULATE MIN / MAX
========================================================= */

function calculateFinexaExtreme(
    column,
    mode
) {

    if (!column) {
        return null;
    }


    const entries =
        finexaRows
            .map(
                row => {

                    const raw =
                        getFinexaRowValue(
                            row,
                            column
                        );

                    const value =
                        finexaToNumber(raw);


                    if (
                        value === null
                    ) {
                        return null;
                    }


                    return {
                        value,
                        raw,
                        row
                    };
                }
            )
            .filter(
                item =>
                    item !== null
            );


    if (!entries.length) {
        return null;
    }


    return entries.reduce(
        (best, current) => {

            if (mode === "min") {

                return current.value <
                    best.value
                    ? current
                    : best;
            }


            return current.value >
                best.value
                ? current
                : best;

        }
    );
}


/* =========================================================
   FIND LIKELY CATEGORY COLUMN
========================================================= */

function findFinexaCategoryColumn() {

    const candidates =
        finexaColumns.filter(
            column => {
            const values =
                    finexaRows
                        .map(
                            row =>
                                getFinexaRowValue(
                                    row,
                                    column
                                )
                        )
                        .filter(
                            value =>
                                value !== null &&
                                value !== undefined &&
                                String(value).trim() !== ""
                        )
                        .map(
                            value =>
                                String(value)
                        );


                if (!values.length) {
                    return false;
                }


                const unique =
                    new Set(values).size;


                return (
                    unique >= 2 &&
                    unique <= 20
                );
            }
        );


    if (!candidates.length) {
        return null;
    }


    let best = null;

    let bestScore = -Infinity;


    candidates.forEach(
        column => {

            const text =
                String(column)
                    .toLowerCase();


            const values =
                finexaRows
                    .map(
                        row =>
                            getFinexaRowValue(
                                row,
                                column
                            )
                    )
                    .filter(
                        value =>
                            value !== null &&
                            value !== undefined &&
                            String(value).trim() !== ""
                    )
                    .map(
                        value =>
                            String(value)
                    );


            const unique =
                new Set(values).size;


            const ratio =
                unique /
                values.length;


            let score = 0;


            if (
                text.includes("product") ||
                text.includes("item") ||
                text.includes("category") ||
                text.includes("department") ||
                text.includes("region") ||
                text.includes("type") ||
                text.includes("name")
            ) {
                score += 8;
            }


            if (
                ratio > 0.03 &&
                ratio < 0.5
            ) {
                score += 4;
            }


            if (
                unique >= 2 &&
                unique <= 12
            ) {
                score += 3;
            }


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                best =
                    column;
            }
        }
    );


    return best;
}


/* =========================================================
   LOAD ANALYST DATA
========================================================= */

async function loadFinexaAnalyst() {

    try {

        const [
            analysisResponse,
            dataResponse
        ] = await Promise.all([

            fetch("/api/analysis"),

            fetch("/api/data")

        ]);


        if (
            !analysisResponse.ok ||
            !dataResponse.ok
        ) {

            throw new Error(
                "FINEXA analyst data could not be loaded."
            );
        }


        const analysis =
            await analysisResponse.json();

        const dataset =
            await dataResponse.json();


        if (
            analysis.success === false
        ) {

            throw new Error(
                analysis.error ||
                "Analysis unavailable."
            );
        }


        if (
            dataset.success === false
        ) {
            throw new Error(
                dataset.error ||
                "Dataset unavailable."
            );
        }


        finexaAnalysisData =
            analysis;


        finexaColumns =
            Array.isArray(dataset.columns)
                ? dataset.columns
                : [];


        finexaRows =
            Array.isArray(dataset.rows)
                ? dataset.rows
                : [];


        buildFinexaAIAnalysis();


    } catch (error) {

        console.error(
            "FINEXA AI Analyst:",
            error
        );


        if (aiAnalysisStatus) {

            aiAnalysisStatus.textContent =
                "Unavailable";
        }


        showFinexaAnalystFallback();
    }
}


/* =========================================================
   BUILD AI ANALYSIS
========================================================= */

function buildFinexaAIAnalysis() {

    const backendInsights =
        Array.isArray(
            finexaAnalysisData?.insights
        )
            ? finexaAnalysisData.insights
            : [];


    const backendRecommendations =
        Array.isArray(
            finexaAnalysisData?.recommendations
        )
            ? finexaAnalysisData.recommendations
            : [];


    const findings = [];


    /* -----------------------------------------
       BACKEND INSIGHTS
    ----------------------------------------- */

    backendInsights.forEach(
        insight => {

            const title =
                insight.title ||
                insight.name ||
                insight.heading ||
                "Data Observation";


            const description =
                insight.description ||
                insight.text ||
                insight.message ||
                insight.insight;


            if (description) {

                findings.push({
                    title,
                    text: description,
                    icon: "✦"
                });
            }
        }
    );


    /* -----------------------------------------
       AUTOMATIC NUMERIC FINDINGS
    ----------------------------------------- */

    const numericColumns =
        getFinexaNumericColumns();


    numericColumns
        .slice(0, 3)
        .forEach(
            column => {

                const average =
                    calculateFinexaAverage(
                        column
                    );


                if (!average) {
                    return;
                }


                findings.push({

                    title:
                        `Average ${column}`,

                    text:
                        `The average ${column} is ${finexaFormatNumber(
                            average.average
                        )}, calculated from ${
                            average.count
                        } available records.`,

                    icon: "≈"
                });
            }
        );


    /* -----------------------------------------
       RECOMMENDATIONS
    ----------------------------------------- */

    const recommendations = [];


    backendRecommendations.forEach(
        recommendation => {

            const title =
                recommendation.title ||
                recommendation.name ||
                "Recommendation";


            const description =
                recommendation.description ||
                recommendation.text ||
                recommendation.message ||
                recommendation.recommendation;


            if (description) {

                recommendations.push({

                    title,

                    text: description,

                    icon: "✦"

                });
            }
        }
    );


    /* -----------------------------------------
       DATA QUALITY RECOMMENDATION
    ----------------------------------------- */

    if (
        finexaColumns.length &&
        finexaRows.length
    ) {

        const missingCount =
            calculateFinexaMissingValues();
            if (
            missingCount > 0
        ) {

            recommendations.push({

                title:
                    "Review Missing Values",

                text:
                    `FINEXA detected ${finexaFormatNumber(
                        missingCount
                    )} missing values. Review incomplete fields before making important decisions.`,

                icon: "!"
            });

        } else {

            recommendations.push({

                title:
                    "Dataset Completeness",

                text:
                    "FINEXA found no obvious missing values in the analyzed rows.",

                icon: "✓"
            });
        }
    }


    renderFinexaFindings(
        findings.slice(0, 6)
    );


    renderFinexaRecommendations(
        recommendations.slice(0, 5)
    );


    if (aiAnalysisStatus) {

        aiAnalysisStatus.textContent =
            "Complete";
    }
}


/* =========================================================
   MISSING VALUE COUNT
========================================================= */

function calculateFinexaMissingValues() {

    let missing = 0;


    finexaRows.forEach(
        row => {

            finexaColumns.forEach(
                column => {

                    const value =
                        getFinexaRowValue(
                            row,
                            column
                        );


                    if (
                        value === null ||
                        value === undefined ||
                        String(value).trim() === ""
                    ) {

                        missing++;
                    }
                }
            );
        }
    );


    return missing;
}


/* =========================================================
   RENDER FINDINGS
========================================================= */

function renderFinexaFindings(
    findings
) {

    if (!aiFindingsList) {
        return;
    }


    aiFindingsList.innerHTML = "";


    if (!findings.length) {

        aiFindingsList.innerHTML =`

            <div class="ai-finding-item">

                <div class="ai-finding-icon">
                    ◈
                </div>

                <div class="ai-finding-content">

                    <span class="ai-finding-title">
                        Dataset analyzed
                    </span>

                    <span class="ai-finding-text">
                        FINEXA analyzed the available
                        structure and values in your dataset.
                    </span>

                </div>

            </div>
        `;

        return;
    }


    findings.forEach(
        finding => {

            const item =
                document.createElement("div");

            item.className =
                "ai-finding-item";


            item.innerHTML =` 

                <div class="ai-finding-icon">
                    ${finding.icon || "✦"}
                </div>

                <div class="ai-finding-content">

                    <span class="ai-finding-title">
                        ${escapeHTML(
                            finding.title
                        )}
                    </span>

                    <span class="ai-finding-text">
                        ${escapeHTML(
                            finding.text
                        )}
                    </span>

                </div>

            `;


            aiFindingsList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   RENDER RECOMMENDATIONS
========================================================= */

function renderFinexaRecommendations(
    recommendations
) {

    if (!aiRecommendationsList) {
        return;
    }


    aiRecommendationsList.innerHTML = "";


    if (!recommendations.length) {

        aiRecommendationsList.innerHTML =`

            <div class="ai-recommendation-item">

                <div class="ai-recommendation-icon">
                    ✦
                </div>

                <div class="ai-recommendation-content">

                    <span class="ai-recommendation-title">
                        Explore Your Data
                    </span>

                    <span class="ai-recommendation-text">
                        Ask FINEXA questions about
                        your uploaded dataset.
                    </span>

                </div>

            </div>
        `;

        return;
    }


    recommendations.forEach(
        recommendation => {

            const item =
                document.createElement("div");

            item.className =
                "ai-recommendation-item";


            item.innerHTML =` 

                <div class="ai-recommendation-icon">
                    ${recommendation.icon || "✦"}
                </div>

                <div class="ai-recommendation-content">

                    <span class="ai-recommendation-title">
                        ${escapeHTML(
                            recommendation.title
                        )}
                    </span>

                    <span class="ai-recommendation-text">
                        ${escapeHTML(
                            recommendation.text
                        )}
                    </span>

                </div>

            `;


            aiRecommendationsList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   FALLBACK
========================================================= */

function showFinexaAnalystFallback() {

    if (aiFindingsList) {

        aiFindingsList.innerHTML =` 

            <div class="ai-finding-item">

                <div class="ai-finding-icon">
                    ◈
                </div>

                <div class="ai-finding-content">

                    <span class="ai-finding-title">
                        Dataset available
                    </span>

                    <span class="ai-finding-text">
                        Ask FINEXA questions directly
                        about your uploaded data.
                    </span>

                </div>

            </div>
        `;
    }


    if (aiRecommendationsList) {

        aiRecommendationsList.innerHTML =`

            <div class="ai-recommendation-item">

                <div class="ai-recommendation-icon">
                    ✦
                </div>

                <div class="ai-recommendation-content">

                    <span class="ai-recommendation-title">
                        Explore the Dataset
                    </span>

                    <span class="ai-recommendation-text">
                        Use the FINEXA analyst chat
                        to explore your data.
                    </span>

                </div>

            </div>
        `;
    }
}


/* =========================================================
   CHAT — ADD MESSAGE
========================================================= */

function addFinexaChatMessage(
    message,
    type = "bot"
) {

    if (!finexaChatMessages) {
        return;
    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        `chat-message ${
            type === "user"
                ? "user-message"
                : "bot-message"
        }`;


    const avatar =
        document.createElement("div");


    avatar.className =
        "chat-message-avatar";
        avatar.textContent =
        type === "user"
            ? "●"
            : "✦";


    const content =
        document.createElement("div");


    content.className =
        "chat-message-content";


    const name =
        document.createElement("span");


    name.className =
        "chat-message-name";


    name.textContent =
        type === "user"
            ? "YOU"
            : "FINEXA";


    const bubble =
        document.createElement("div");


    bubble.className =
        "chat-bubble";


    bubble.textContent =
        message;


    content.appendChild(name);

    content.appendChild(bubble);

    wrapper.appendChild(avatar);

    wrapper.appendChild(content);


    finexaChatMessages.appendChild(
        wrapper
    );


    finexaChatMessages.scrollTop =
        finexaChatMessages.scrollHeight;
}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showFinexaTyping() {

    if (!finexaChatMessages) {
        return;
    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "chat-message bot-message";


    wrapper.id =
        "finexaTypingMessage";


    wrapper.innerHTML =`

        <div class="chat-message-avatar">
            ✦
        </div>

        <div class="chat-message-content">

            <span class="chat-message-name">
                FINEXA
            </span>

            <div class="chat-typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>
    `;


    finexaChatMessages.appendChild(
        wrapper
    );


    finexaChatMessages.scrollTop =
        finexaChatMessages.scrollHeight;
}


function removeFinexaTyping() {

    const typing =
        document.getElementById(
            "finexaTypingMessage"
        );


    if (typing) {
        typing.remove();
    }
}


/* =========================================================
   AVERAGE / MEAN
========================================================= */

function answerAverageQuestion(
    question
) {

    const numericColumns =
        getFinexaNumericColumns();


    if (!numericColumns.length) {

        return "I couldn't find a numeric column to calculate an average or mean from your dataset.";
    }


    const lower =
        question.toLowerCase();


    let selectedColumn = null;


    numericColumns.forEach(
        column => {

            const columnText =
                String(column)
                    .toLowerCase();


            if (
                lower.includes(columnText)
            ) {

                selectedColumn =
                    column;
            }
        }
    );


    if (!selectedColumn) {

        selectedColumn =
            findFinexaColumnByKeywords([
                "price",
                "sales",
                "revenue",
                "income",
                "amount",
                "salary",
                "cost",
                "value",
                "marks",
                "rating",
                "age"
            ]);
    }


    if (!selectedColumn) {

        selectedColumn =
            numericColumns[0];
    }


    const result =
        calculateFinexaAverage(
            selectedColumn
        );


    if (!result) {

        return `I couldn't calculate the average for ${selectedColumn}.`;
    }


    return `The average (mean) of ${selectedColumn} is ${finexaFormatNumber(
        result.average
    )}, calculated from ${
        result.count
    } available records.`;
}


/* =========================================================
   HIGHEST VALUE
========================================================= */

function answerHighestQuestion(
    question
) {

    const numericColumns =
        getFinexaNumericColumns();


    if (!numericColumns.length) {

        return "I couldn't find a numeric column to determine the highest value.";
    }


    const lower =
        question.toLowerCase();


    let column = null;
    numericColumns.forEach(
        item => {

            if (
                lower.includes(
                    String(item).toLowerCase()
                )
            ) {

                column = item;
            }
        }
    );


    if (!column) {

        column =
            findFinexaColumnByKeywords([
                "price",
                "sales",
                "revenue",
                "income",
                "amount",
                "salary",
                "cost",
                "value",
                "marks",
                "rating"
            ]);
    }


    if (!column) {
        column = numericColumns[0];
    }


    const result =
        calculateFinexaExtreme(
            column,
            "max"
        );


    if (!result) {

        return `I couldn't determine the highest value for ${column}.`;
    }


    return `The highest ${column} is ${finexaFormatNumber(
        result.value
    )}.`;
}


/* =========================================================
   LOWEST VALUE
========================================================= */

function answerLowestQuestion(
    question
) {

    const numericColumns =
        getFinexaNumericColumns();


    if (!numericColumns.length) {

        return "I couldn't find a numeric column to determine the lowest value.";
    }


    const lower =
        question.toLowerCase();


    let column = null;


    numericColumns.forEach(
        item => {

            if (
                lower.includes(
                    String(item).toLowerCase()
                )
            ) {

                column = item;
            }
        }
    );


    if (!column) {

        column =
            findFinexaColumnByKeywords([
                "price",
                "sales",
                "revenue",
                "income",
                "amount",
                "salary",
                "cost",
                "value",
                "marks",
                "rating"
            ]);
    }


    if (!column) {
        column = numericColumns[0];
    }


    const result =
        calculateFinexaExtreme(
            column,
            "min"
        );


    if (!result) {

        return `I couldn't determine the lowest value for ${column}.`;
    }


    return `The lowest ${column} is ${finexaFormatNumber(
        result.value
    )}.`;
}


/* =========================================================
   RECORD COUNT
========================================================= */

function answerRecordCount() {

    `return Your dataset contains ${finexaFormatNumber(
        finexaRows.length
    )} records.`;
}


/* =========================================================
   COLUMN COUNT
========================================================= */

function answerColumnCount() {

    return `Your dataset contains ${finexaFormatNumber(
        finexaColumns.length
    )} columns.`;
}


/* =========================================================
   DATASET SUMMARY
========================================================= */

function answerDatasetSummary() {

    const numeric =
        getFinexaNumericColumns();


    const category =
        findFinexaCategoryColumn();


    let response =
        `FINEXA analyzed ${finexaFormatNumber(
            finexaRows.length
        )} records across ${finexaFormatNumber(
            finexaColumns.length
        )} columns.`;


    if (numeric.length) {

        response +=
             `I detected ${numeric.length} numeric field${
                numeric.length === 1
                    ? ""
                    : "s"
            }.`;
    }


    if (category) {

        response +=
             `A meaningful categorical field is ${category}.`;
    }


    return response;
}


/* =========================================================
   OWNER QUESTION
========================================================= */

function isOwnerQuestion(
    question
) {

    const lower =
        question
            .toLowerCase()
            .trim();
            return (
        lower.includes("who is your owner") ||
        lower.includes("who owns you") ||
        lower.includes("who owns finexa") ||
        lower.includes("owner of finexa") ||
        lower === "owner?"
    );
}


/* =========================================================
   GREETING
========================================================= */

function isFinexaGreeting(
    question
) {

    const lower =
        question
            .toLowerCase()
            .trim()
            .replace(/[!?.,]+$/g, "");


    return (
        lower === "hi" ||
        lower === "hello" ||
        lower === "hey"
    );
}


/* =========================================================
   GENERATE CHAT ANSWER
========================================================= */

function generateFinexaAnswer(
    question
) {

    const lower =
        question
            .toLowerCase()
            .trim();


    /* -----------------------------------------
       FIXED HI RESPONSE
    ----------------------------------------- */

    if (
        lower.replace(/[!?.,]+$/g, "") ===
        "hi"
    ) {

        return "Hi I'm Finexa how can I help you";
    }


    /* -----------------------------------------
       FIXED OWNER RESPONSE
    ----------------------------------------- */

    if (
        isOwnerQuestion(question)
    ) {

        return "Arun Saxena is owner of Finexa by Auroun DataSYN";
    }


    /* -----------------------------------------
       GENERAL GREETING
    ----------------------------------------- */

    if (
        isFinexaGreeting(question)
    ) {

        return "Hi I'm Finexa how can I help you";
    }


    /* -----------------------------------------
       RECORD COUNT
    ----------------------------------------- */

    if (
        lower.includes("how many records") ||
        lower.includes("how many rows") ||
        lower.includes("number of records") ||
        lower.includes("total records")
    ) {

        return answerRecordCount();
    }


    /* -----------------------------------------
       COLUMN COUNT
    ----------------------------------------- */

    if (
        lower.includes("how many columns") ||
        lower.includes("number of columns") ||
        lower.includes("total columns")
    ) {

        return answerColumnCount();
    }


    /* -----------------------------------------
       AVERAGE / MEAN
    ----------------------------------------- */

    if (
        lower.includes("average") ||
        lower.includes("mean")
    ) {

        return answerAverageQuestion(
            question
        );
    }


    /* -----------------------------------------
       HIGHEST
    ----------------------------------------- */

    if (
        lower.includes("highest") ||
        lower.includes("maximum") ||
        lower.includes("max value") ||
        lower.includes("largest")
    ) {

        return answerHighestQuestion(
            question
        );
    }


    /* -----------------------------------------
       LOWEST
    ----------------------------------------- */

    if (
        lower.includes("lowest") ||
        lower.includes("minimum") ||
        lower.includes("min value") ||
        lower.includes("smallest")
    ) {

        return answerLowestQuestion(
            question
        );
    }


    /* -----------------------------------------
       DATASET SUMMARY
    ----------------------------------------- */

    if (
        lower.includes("tell me about my data") ||
        lower.includes("summarize my data") ||
        lower.includes("dataset summary") ||
        lower.includes("what is in my data")
    ) {

        return answerDatasetSummary();
    }


    /* -----------------------------------------
       FALLBACK
    ----------------------------------------- */

    return "I can analyze your uploaded dataset. Try asking me about an average, mean, highest value, lowest value, number of records, or a specific numeric column.";
}
/* =========================================================
   SEND CHAT MESSAGE
========================================================= */

function sendFinexaMessage() {

    if (!finexaChatInput) {
        return;
    }


    const question =
        finexaChatInput.value.trim();


    if (!question) {
        return;
    }


    addFinexaChatMessage(
        question,
        "user"
    );


    finexaChatInput.value = "";


    if (finexaSuggestions) {

        finexaSuggestions.style.display =
            "none";
    }


    showFinexaTyping();


    setTimeout(
        () => {

            removeFinexaTyping();


            const answer =
                generateFinexaAnswer(
                    question
                );


            addFinexaChatMessage(
                answer,
                "bot"
            );

        },
        450
    );
}


/* =========================================================
   SEND BUTTON
========================================================= */

if (finexaChatSend) {

    finexaChatSend.addEventListener(
        "click",
        sendFinexaMessage
    );
}


/* =========================================================
   ENTER KEY
========================================================= */

if (finexaChatInput) {

    finexaChatInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendFinexaMessage();
            }
        }
    );
}


/* =========================================================
   SUGGESTION BUTTONS
========================================================= */

if (finexaSuggestions) {

    finexaSuggestions
        .querySelectorAll(
            ".finexa-suggestion"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (!finexaChatInput) {
                            return;
                        }


                        finexaChatInput.value =
                            button.textContent.trim();


                        sendFinexaMessage();
                    }
                );
            }
        );
}


/* =========================================================
   START PART 8 ANALYST
========================================================= */

loadFinexaAnalyst();
/* =========================================================
   PART 9 — BRANDED REPORT + ACTION CENTER JS
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const downloadReportButton =
    document.getElementById(
        "downloadReportButton"
    );

const exportDataButton =
    document.getElementById(
        "exportDataButton"
    );

const reportPreviewDataset =
    document.getElementById(
        "reportPreviewDataset"
    );

const actionsEmptyState =
    document.getElementById(
        "actionsEmptyState"
    );


/* =========================================================
   LOAD REPORT INFORMATION
========================================================= */

async function loadReportInformation() {

    try {

        const response =
            await fetch("/api/analysis");


        if (!response.ok) {

            throw new Error(
                "Analysis information unavailable."
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(
                data?.error ||
                "No analysis available."
            );
        }


        /* -----------------------------------------
           DATASET NAME
        ----------------------------------------- */

        if (reportPreviewDataset) {

            reportPreviewDataset.textContent =
                data.filename ||
                data.file_name ||
                "Uploaded Dataset";
        }


        /* -----------------------------------------
           SHOW ACTION CENTER
        ----------------------------------------- */

        if (actionsEmptyState) {

            actionsEmptyState.style.display =
                "none";
        }


    } catch (error) {

        console.error(
            "FINEXA Report:",
            error
        );


        if (reportPreviewDataset) {

            reportPreviewDataset.textContent =
                "Analysis Dataset";
        }

    }
}


/* =========================================================
   DOWNLOAD BRANDED REPORT
========================================================= */

async function downloadFinexaReport() {

    if (!downloadReportButton) {
        return;
    }


    const originalHTML =
        downloadReportButton.innerHTML;


    /* -----------------------------------------
       LOADING STATE
    ----------------------------------------- */

    downloadReportButton.disabled =
        true;


    downloadReportButton.innerHTML =` 

        <span>
            Preparing Branded Report...
        </span>

        <strong>
            ⋯
        </strong>

    `;


    try {

        const response =
            await fetch(
                "/download-report",
                {
                    method: "GET"
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Report generation failed.";


            try {

                const errorData =
                    await response.json();


                if (errorData?.error) {

                    errorMessage =
                        errorData.error;
                }

            } catch (_) {
                /* Ignore JSON parsing failure */
            }


            throw new Error(
                errorMessage
            );
        }


        /* -----------------------------------------
           GET PDF BLOB
        ----------------------------------------- */

        const blob =
            await response.blob();


        if (
            !blob ||
            blob.size === 0
        ) {

            throw new Error(
                "The generated report is empty."
            );
        }


        /* -----------------------------------------
           CREATE DOWNLOAD
        ----------------------------------------- */
        const url =
            window.URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "FINEXA_Analysis_Report.pdf";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
            url
        );


        /* -----------------------------------------
           SUCCESS STATE
        ----------------------------------------- */

        downloadReportButton.innerHTML =`

            <span>
                Report Downloaded
            </span>

            <strong>
                ✓
            </strong>

        `;


        setTimeout(
            () => {

                downloadReportButton.innerHTML =
                    originalHTML;

                downloadReportButton.disabled =
                    false;

            },
            2200
        );


    } catch (error) {

        console.error(
            "FINEXA Report Download:",
            error
        );


        downloadReportButton.innerHTML =`

            <span>
                Report Generation Failed
            </span>

            <strong>
                !
            </strong>

        `;


        setTimeout(
            () => {

                downloadReportButton.innerHTML =
                    originalHTML;

                downloadReportButton.disabled =
                    false;

            },
            2500
        );


        alert(
            error.message ||
            "FINEXA could not generate the report."
        );
    }
}


/* =========================================================
   EXPORT DATA
========================================================= */

async function exportFinexaData() {

    if (!exportDataButton) {
        return;
    }


    const originalHTML =
        exportDataButton.innerHTML;


    exportDataButton.disabled =
        true;


    exportDataButton.innerHTML =`

        <span>
            Preparing Data...
        </span>

        <strong>
            ⋯
        </strong>

    `;


    try {

        const response =
            await fetch(
                "/api/data"
            );


        if (!response.ok) {

            throw new Error(
                "Dataset could not be exported."
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(
                data?.error ||
                "Dataset unavailable."
            );
        }


        const columns =
            Array.isArray(data.columns)
                ? data.columns
                : [];


        const rows =
            Array.isArray(data.rows)
                ? data.rows
                : [];


        if (
            !columns.length ||
            !rows.length
        ) {

            throw new Error(
                "No dataset rows are available for export."
            );
        }


        /* -----------------------------------------
           CSV HEADER
        ----------------------------------------- */

        const csvRows = [];


        csvRows.push(
            columns
                .map(
                    column =>
                        escapeCSVValue(column)
                )
                .join(",")
        );


        /* -----------------------------------------
           CSV ROWS
        ----------------------------------------- */

        rows.forEach(
            row => {

                const values =
                    columns.map(
                        column =>
                            escapeCSVValue(
                                getFinexaRowValue(
                                    row,
                                    column
                                )
                            )
                    );
                    csvRows.push(
                    values.join(",")
                );
            }
        );


        const csv =
            "\uFEFF" +
            csvRows.join("\r\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            window.URL.createObjectURL(
                blob
            );


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "FINEXA_Analyzed_Data.csv";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
            url
        );


        /* -----------------------------------------
           SUCCESS
        ----------------------------------------- */

        exportDataButton.innerHTML =` 

            <span>
                Data Exported
            </span>

            <strong>
                ✓
            </strong>

        `;


        setTimeout(
            () => {

                exportDataButton.innerHTML =
                    originalHTML;

                exportDataButton.disabled =
                    false;

            },
            2000
        );


    } catch (error) {

        console.error(
            "FINEXA Data Export:",
            error
        );


        exportDataButton.innerHTML =`

            <span>
                Export Failed
            </span>

            <strong>
                !
            </strong>

        `;


        setTimeout(
            () => {

                exportDataButton.innerHTML =
                    originalHTML;

                exportDataButton.disabled =
                    false;

            },
            2200
        );


        alert(
            error.message ||
            "FINEXA could not export the dataset."
        );
    }
}


/* =========================================================
   CSV ESCAPE
========================================================= */

function escapeCSVValue(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    const text =
        String(value);


    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n") ||
        text.includes("\r")
    ) {

        return `"${text.replace(
            /"/g,
            '""'
        )}"`;
    }


    return text;
}


/* =========================================================
   REPORT BUTTON
========================================================= */

if (downloadReportButton) {

    downloadReportButton.addEventListener(
        "click",
        downloadFinexaReport
    );
}


/* =========================================================
   EXPORT BUTTON
========================================================= */

if (exportDataButton) {

    exportDataButton.addEventListener(
        "click",
        exportFinexaData
    );
}


/* =========================================================
   INITIALIZE REPORT
========================================================= */

loadReportInformation();
