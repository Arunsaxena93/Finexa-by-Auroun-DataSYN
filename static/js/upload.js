document.addEventListener("DOMContentLoaded", function () {

    console.log("FINEXA upload.js loaded");


    /* =========================================
       ELEMENTS
    ========================================= */

    const uploadArea = document.getElementById("uploadArea");

    const documentFile = document.getElementById("documentFile");

    const browseButton = document.getElementById("browseButton");

    const selectedDocument =
        document.getElementById("selectedDocument");

    const selectedFileName =
        document.getElementById("selectedFileName");

    const selectedFileSize =
        document.getElementById("selectedFileSize");

    const removeFile =
        document.getElementById("removeFile");

    const analyzeButton =
        document.getElementById("analyzeButton");

    const analysisStatus =
        document.getElementById("analysisStatus");


    const stepDocument =
        document.getElementById("stepDocument");

    const stepAnalysis =
        document.getElementById("stepAnalysis");

    const stepResults =
        document.getElementById("stepResults");


    /* =========================================
       CHECK ELEMENTS
    ========================================= */

    if (!documentFile) {
        console.error("documentFile not found");
        return;
    }

    if (!browseButton) {
        console.error("browseButton not found");
        return;
    }


    /* =========================================
       BROWSE BUTTON
    ========================================= */

    browseButton.addEventListener("click", function (event) {

        event.preventDefault();

        console.log("Browse button clicked");

        documentFile.click();

    });


    /* =========================================
       UPLOAD AREA CLICK
    ========================================= */

    uploadArea.addEventListener("click", function (event) {

        if (
            event.target === browseButton ||
            browseButton.contains(event.target)
        ) {
            return;
        }

        documentFile.click();

    });


    /* =========================================
       FILE SELECTED
    ========================================= */

    documentFile.addEventListener("change", function () {

        console.log("File input changed");

        if (!documentFile.files.length) {
            return;
        }

        const file = documentFile.files[0];

        showSelectedFile(file);

    });


    /* =========================================
       SHOW FILE
    ========================================= */

    function showSelectedFile(file) {

        selectedDocument.style.display = "flex";

        selectedFileName.textContent = file.name;

        selectedFileSize.textContent =
            formatFileSize(file.size) +
            " • " +
            fileExtension(file.name);


        analyzeButton.disabled = false;


        analysisStatus.innerHTML =
            '<span></span> Document ready for analysis';


        analysisStatus.classList.add("ready");


        stepDocument.classList.add("active");

        stepAnalysis.classList.remove("active");

        stepResults.classList.remove("active");


        browseButton.querySelector(".button-icon").textContent = "✓";

        browseButton.querySelector("span:last-of-type").textContent =
            "Change File";

    }


    /* =========================================
       REMOVE FILE
    ========================================= */

    removeFile.addEventListener("click", function (event) {

        event.preventDefault();

        event.stopPropagation();

        documentFile.value = "";

        selectedDocument.style.display = "none";

        selectedFileName.textContent =
            "No document selected";

        selectedFileSize.textContent =
            "Choose a document to continue";


        analyzeButton.disabled = true;


        analysisStatus.innerHTML =
            '<span></span> Waiting for document';


        analysisStatus.classList.remove("ready");
        browseButton.querySelector(".button-icon").textContent = "↑";

        browseButton.querySelector("span:last-of-type").textContent =
            "Browse File";


        stepDocument.classList.add("active");

        stepAnalysis.classList.remove("active");

        stepResults.classList.remove("active");

    });


    /* =========================================
       DRAG OVER
    ========================================= */

    uploadArea.addEventListener("dragover", function (event) {

        event.preventDefault();

        uploadArea.classList.add("drag-active");

    });


    /* =========================================
       DRAG LEAVE
    ========================================= */

    uploadArea.addEventListener("dragleave", function () {

        uploadArea.classList.remove("drag-active");

    });


    /* =========================================
       DROP
    ========================================= */

    uploadArea.addEventListener("drop", function (event) {

        event.preventDefault();

        uploadArea.classList.remove("drag-active");


        const files = event.dataTransfer.files;

        if (!files.length) {
            return;
        }


        const file = files[0];


        if (!isSupportedFile(file)) {

            alert(
                "Please select an XLSX, XLS, CSV or JSON file."
            );

            return;

        }


        /*
         * Put dropped file into the real input
         */
        try {

            const dataTransfer = new DataTransfer();

            dataTransfer.items.add(file);

            documentFile.files = dataTransfer.files;

        } catch (error) {

            console.log(
                "Browser prevented assigning dropped file."
            );

        }


        showSelectedFile(file);

    });


    /* =========================================
       FILE VALIDATION
    ========================================= */

    function isSupportedFile(file) {

        const allowedExtensions = [
            "xlsx",
            "xls",
            "csv",
            "json"
        ];

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        return allowedExtensions.includes(extension);

    }


    /* =========================================
       EXTENSION
    ========================================= */

    function fileExtension(filename) {

        const extension =
            filename
                .split(".")
                .pop()
                .toUpperCase();

        return extension;

    }


    /* =========================================
       FILE SIZE
    ========================================= */

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }


        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];


        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );


        return (
            parseFloat(
                (bytes /
                    Math.pow(1024, index))
                    .toFixed(2)
            ) +
            " " +
            units[index]
        );

    }


    /* =========================================
       ANALYZE BUTTON
    ========================================= */

    analyzeButton.addEventListener("click", function () {

        if (
            analyzeButton.disabled ||
            !documentFile.files.length
        ) {
            return;
        }


        console.log(
            "Analyze button clicked"
        );


        startAnalysis();

    });


    /* =========================================
       ANALYSIS ANIMATION + REAL BACKEND
    ========================================= */

function startAnalysis() {

    analyzeButton.disabled = true;
    removeFile.disabled = true;
    browseButton.disabled = true;

    stepDocument.classList.remove("active");
    stepAnalysis.classList.add("active");
    stepResults.classList.remove("active");

    analysisStatus.innerHTML =
        '<span></span> Preparing document...';


    // Create form data
    const formData = new FormData();

    formData.append(
        "file",
        documentFile.files[0]
    );


    // Send document to Flask
    fetch("/analyze", {
        method: "POST",
        body: formData
    })

    .then(async function (response) {

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Document analysis failed."
            );
        }

        return data;
    })


    .then(function (data) {

        // Show analysis stages
        analysisStatus.innerHTML =
            '<span></span> Extracting financial data...';


        setTimeout(function () {

            analysisStatus.innerHTML =
                '<span></span> Cleaning and processing data...';

        }, 700);


        setTimeout(function () {

            analysisStatus.innerHTML =
                '<span></span> Analyzing financial information...';

        }, 1400);


        setTimeout(function () {

            analysisStatus.innerHTML =
                '<span></span> Analysis complete';

            stepAnalysis.classList.remove("active");
            stepResults.classList.add("active");


            // Go to real result page
            setTimeout(function () {

                window.location.href =
                    data.redirect;

            }, 700);


        }, 2100);

    })


    .catch(function (error) {

        console.error(
            "FINEXA ANALYSIS ERROR:",
            error
        );


        analysisStatus.innerHTML =
            '<span></span> Analysis failed';


        analyzeButton.disabled = false;
        removeFile.disabled = false;
        browseButton.disabled = false;


        stepDocument.classList.add("active");
        stepAnalysis.classList.remove("active");
        stepResults.classList.remove("active");


        alert(
            error.message ||
            "Something went wrong while analyzing the document."
        );

    });

}


    /* =========================================
       INITIAL STATE
    ========================================= */

    selectedDocument.style.display = "none";

    analyzeButton.disabled = true;

    console.log(
        "FINEXA document analysis interface ready"
    );

});
/* =========================================================
   PART 2 — SAMPLE ANALYTICS JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const sampleAnalytics =
        document.getElementById("sampleAnalytics");

    if (!sampleAnalytics) {
        return;
    }


    /* =========================================
       SAMPLE ANALYTICS OBSERVER
    ========================================= */

    const sampleObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        sampleAnalytics.classList.add(
                            "analytics-visible"
                        );

                        animateSampleCharts();

                        sampleObserver.unobserve(
                            sampleAnalytics
                        );
                    }

                });

            },
            {
                threshold: 0.18
            }
        );


    sampleObserver.observe(sampleAnalytics);



    /* =========================================
       BAR CHART ANIMATION
    ========================================= */

    function animateSampleCharts() {

        const bars =
            sampleAnalytics.querySelectorAll(
                ".sample-bar"
            );


        bars.forEach(function (bar, index) {

            const originalHeight =
                bar.style.height;


            bar.style.height = "0%";

            bar.style.opacity = "0";

            bar.style.transform =
                "scaleY(0)";


            setTimeout(function () {

                bar.style.height =
                    originalHeight;

                bar.style.opacity = "1";

                bar.style.transform =
                    "scaleY(1)";

            }, 150 + (index * 90));

        });


        /* =====================================
           DONUT
        ===================================== */

        const donut =
            sampleAnalytics.querySelector(
                ".donut-chart"
            );


        if (donut) {

            donut.style.opacity = "0";

            donut.style.transform =
                "rotate(-70deg) scale(.75)";


            setTimeout(function () {

                donut.style.opacity = "1";

                donut.style.transform =
                    "rotate(0deg) scale(1)";

            }, 350);

        }


        /* =====================================
           GROWTH LINE
        ===================================== */

        const growthLine =
            sampleAnalytics.querySelector(
                ".growth-line"
            );


        if (growthLine) {

            growthLine.style.animation =
                "none";


            void growthLine.offsetWidth;


            growthLine.style.animation =
                "line-draw 2s cubic-bezier(.22,.61,.36,1) forwards";

        }


        /* =====================================
           GROWTH AREA
        ===================================== */

        const growthArea =
            sampleAnalytics.querySelector(
                ".growth-area"
            );


        if (growthArea) {

            growthArea.style.animation =
                "none";


            void growthArea.offsetWidth;


            growthArea.style.animation =
                "area-fade 1.5s ease forwards";

        }


        /* =====================================
           LINE POINTS
        ===================================== */

        const points =
            sampleAnalytics.querySelectorAll(
                ".growth-svg circle"
            );


        points.forEach(function (point, index) {

            point.style.opacity = "0";


            setTimeout(function () {

                point.style.opacity = "1";

            }, 800 + (index * 130));

        });

    }
    /* =========================================
       CARD MOUSE MOVEMENT
    ========================================= */

    const cards =
        sampleAnalytics.querySelectorAll(
            ".sample-chart-card"
        );


    cards.forEach(function (card) {

        card.addEventListener(
            "mousemove",
            function (event) {

                if (window.innerWidth <= 850) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) / centerY) * -1.5;

                const rotateY =
                    ((x - centerX) / centerX) * 1.5;


                card.style.transform =
                    
                    `translateY(-6px)
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)`
                    ;

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                card.style.transform =
                    "";

            }
        );

    });



    /* =========================================
       PERIOD DISPLAY
    ========================================= */

    const period =
        sampleAnalytics.querySelector(
            ".chart-period"
        );


    if (period) {

        let pulse = false;


        setInterval(function () {

            pulse = !pulse;


            period.style.borderColor =
                pulse
                    ? "rgba(108,99,255,.25)"
                    : "rgba(255,255,255,.065)";

        }, 1800);

    }



    /* =========================================
       SAMPLE STATUS PULSE
    ========================================= */

    const sampleStatus =
        sampleAnalytics.querySelector(
            ".sample-status"
        );


    if (sampleStatus) {

        sampleStatus.addEventListener(
            "mouseenter",
            function () {

                sampleStatus.style.transform =
                    "translateY(-2px)";

            }
        );


        sampleStatus.addEventListener(
            "mouseleave",
            function () {

                sampleStatus.style.transform =
                    "";

            }
        );

    }


});
/* =========================================================
   PART 3 — FINEXA PLATFORM JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const platform =
        document.getElementById("finexaPlatform");

    if (!platform) {
        return;
    }

    /* ---------------------------------------------------------
       REVEAL PLATFORM SECTION
    --------------------------------------------------------- */

    const platformObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        platform.classList.add(
                            "platform-visible"
                        );

                        animatePlatform();

                        platformObserver.unobserve(
                            platform
                        );
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

    platformObserver.observe(platform);


    /* ---------------------------------------------------------
       PLATFORM ANIMATION
    --------------------------------------------------------- */

    function animatePlatform() {

        const heading =
            platform.querySelector(
                ".platform-heading"
            );

        const visual =
            platform.querySelector(
                ".platform-visual"
            );

        const features =
            platform.querySelectorAll(
                ".platform-feature"
            );

        const flowItems =
            platform.querySelectorAll(
                ".flow-item"
            );

        const connectors =
            platform.querySelectorAll(
                ".flow-connector"
            );

        if (heading) {

            heading.style.opacity = "0";
            heading.style.transform =
                "translateY(35px)";

            setTimeout(function () {

                heading.style.opacity = "1";
                heading.style.transform =
                    "translateY(0)";

            }, 120);

        }


        if (visual) {

            visual.style.opacity = "0";
            visual.style.transform =
                "scale(.88)";

            setTimeout(function () {

                visual.style.opacity = "1";
                visual.style.transform =
                    "scale(1)";

            }, 300);

        }


        features.forEach(function (feature, index) {

            feature.style.opacity = "0";
            feature.style.transform =
                "translateX(35px)";

            setTimeout(function () {

                feature.style.opacity = "1";
                feature.style.transform =
                    "translateX(0)";

            }, 450 + (index * 170));

        });


        flowItems.forEach(function (item, index) {

            item.style.opacity = "0";
            item.style.transform =
                "translateY(18px)";

            setTimeout(function () {

                item.style.opacity = "1";
                item.style.transform =
                    "translateY(0)";

            }, 900 + (index * 130));

        });


        connectors.forEach(function (connector, index) {

            connector.style.transform =
                "scaleX(0)";

            connector.style.transformOrigin =
                "left center";

            setTimeout(function () {

                connector.style.transform =
                    "scaleX(1)";

            }, 1050 + (index * 130));

        });

    }


    /* ---------------------------------------------------------
       FEATURE HOVER INTERACTION
    --------------------------------------------------------- */

    const features =
        platform.querySelectorAll(
            ".platform-feature"
        );

    features.forEach(function (feature) {
        feature.addEventListener(
            "mouseenter",
            function () {

                const number =
                    feature.querySelector(
                        ".feature-number"
                    );

                if (number) {

                    number.style.transform =
                        "scale(1.08) rotate(3deg)";

                    number.style.borderColor =
                        "rgba(108,99,255,.42)";

                }

            }
        );


        feature.addEventListener(
            "mouseleave",
            function () {

                const number =
                    feature.querySelector(
                        ".feature-number"
                    );

                if (number) {

                    number.style.transform = "";
                    number.style.borderColor = "";

                }

            }
        );

    });


    /* ---------------------------------------------------------
       CORE INTERACTION
    --------------------------------------------------------- */

    const core =
        platform.querySelector(
            ".visual-core"
        );

    if (core) {

        core.addEventListener(
            "mouseenter",
            function () {

                core.style.transform =
                    "scale(1.06)";

                core.style.boxShadow =
                    "0 0 65px rgba(108,99,255,.25), inset 0 1px 0 rgba(255,255,255,.08)";

            }
        );


        core.addEventListener(
            "mouseleave",
            function () {

                core.style.transform = "";

                core.style.boxShadow = "";

            }
        );

    }


    /* ---------------------------------------------------------
       FLOATING NODE INTERACTION
    --------------------------------------------------------- */

    const nodes =
        platform.querySelectorAll(
            ".floating-node"
        );

    nodes.forEach(function (node) {

        node.addEventListener(
            "mouseenter",
            function () {

                node.style.transform =
                    "translateY(-8px) scale(1.06)";

                node.style.borderColor =
                    "rgba(108,99,255,.30)";

            }
        );


        node.addEventListener(
            "mouseleave",
            function () {

                node.style.transform = "";
                node.style.borderColor = "";

            }
        );

    });


    /* ---------------------------------------------------------
       SUBTLE MOUSE PARALLAX
    --------------------------------------------------------- */

    if (window.innerWidth > 850) {

        platform.addEventListener(
            "mousemove",
            function (event) {

                const visual =
                    platform.querySelector(
                        ".platform-visual"
                    );

                if (!visual) {
                    return;
                }

                const rect =
                    platform.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const moveX =
                    ((x - centerX) / centerX) * 5;

                const moveY =
                    ((y - centerY) / centerY) * 5;

                visual.style.transform =
                    `translate(${moveX}px, ${moveY}px)`;

            }
        );


        platform.addEventListener(
            "mouseleave",
            function () {

                const visual =
                    platform.querySelector(
                        ".platform-visual"
                    );

                if (visual) {
                    visual.style.transform = "";
                }

            }
        );

    }
    /* ---------------------------------------------------------
       FLOW CONNECTOR PULSE
    --------------------------------------------------------- */

    const flow =
        platform.querySelector(
            ".platform-flow"
        );

    if (flow) {

        setInterval(function () {

            const connector =
                flow.querySelector(
                    ".flow-connector"
                );

            if (!connector) {
                return;
            }

            connector.style.opacity = ".35";

            setTimeout(function () {

                connector.style.opacity = "1";

            }, 450);

        }, 2400);

    }


    console.log(
        "FINEXA Part 3 platform interface ready"
    );

});
/* =========================================================
   PART 4 — EXPLORE & FILTER DATA JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const exploreData =
        document.getElementById("exploreData");

    if (!exploreData) {
        return;
    }

    const dateRange =
        document.getElementById("dateRange");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const metricFilter =
        document.getElementById("metricFilter");

    const viewMode =
        document.getElementById("viewMode");

    const resetFilters =
        document.getElementById("resetFilters");

    const activeFilters =
        document.getElementById("activeFilters");

    const filterControls = [
        dateRange,
        categoryFilter,
        metricFilter,
        viewMode
    ];


    /* ---------------------------------------------------------
       SECTION REVEAL
    --------------------------------------------------------- */

    const exploreObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        exploreData.classList.add(
                            "explore-visible"
                        );

                        animateExplore();

                        exploreObserver.unobserve(
                            exploreData
                        );
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    exploreObserver.observe(exploreData);


    function animateExplore() {

        const heading =
            exploreData.querySelector(
                ".explore-heading"
            );

        const panel =
            exploreData.querySelector(
                ".filter-panel"
            );

        const preview =
            exploreData.querySelector(
                ".explore-preview"
            );

        if (heading) {

            heading.style.opacity = "0";
            heading.style.transform =
                "translateY(30px)";

            setTimeout(function () {

                heading.style.opacity = "1";
                heading.style.transform =
                    "translateY(0)";

            }, 100);
        }


        if (panel) {

            panel.style.opacity = "0";
            panel.style.transform =
                "translateY(35px)";

            setTimeout(function () {

                panel.style.opacity = "1";
                panel.style.transform =
                    "translateY(0)";

            }, 300);
        }


        if (preview) {

            preview.style.opacity = "0";
            preview.style.transform =
                "translateY(35px)";

            setTimeout(function () {

                preview.style.opacity = "1";
                preview.style.transform =
                    "translateY(0)";

            }, 550);
        }

    }


    /* ---------------------------------------------------------
       FILTER INTERACTION
    --------------------------------------------------------- */

    filterControls.forEach(function (control) {

        if (!control) {
            return;
        }

        control.addEventListener(
            "change",
            function () {

                updateActiveFilters();

                control.parentElement.classList.add(
                    "filter-updated"
                );

                setTimeout(function () {

                    control.parentElement.classList.remove(
                        "filter-updated"
                    );

                }, 500);

            }
        );

    });


    function updateActiveFilters() {

        if (!activeFilters) {
            return;
        }

        const oldChips =
            activeFilters.querySelectorAll(
                ".filter-chip"
            );
            oldChips.forEach(function (chip) {
            chip.remove();
        });


        const values = [
            {
                element: dateRange,
                label: "Date Range"
            },
            {
                element: categoryFilter,
                label: "Category"
            },
            {
                element: metricFilter,
                label: "Metric"
            },
            {
                element: viewMode,
                label: "View"
            }
        ];


        values.forEach(function (item) {

            if (!item.element) {
                return;
            }

            const selected =
                item.element.options[
                    item.element.selectedIndex
                ];

            if (!selected) {
                return;
            }


            const chip =
                document.createElement("button");

            chip.type = "button";
            chip.className = "filter-chip";

            chip.innerHTML =
                
                `${selected.textContent.trim()}
                <b>×</b>
                `;


            chip.addEventListener(
                "click",
                function () {

                    item.element.selectedIndex = 0;

                    updateActiveFilters();

                }
            );


            activeFilters.appendChild(chip);

        });

    }


    /* ---------------------------------------------------------
       RESET ALL FILTERS
    --------------------------------------------------------- */

    if (resetFilters) {

        resetFilters.addEventListener(
            "click",
            function () {

                filterControls.forEach(
                    function (control) {

                        if (control) {
                            control.selectedIndex = 0;
                        }

                    }
                );

                /*
                 * Revenue is the default primary metric.
                 */
                if (metricFilter) {
                    metricFilter.value = "revenue";
                }

                updateActiveFilters();

                resetFilters.textContent =
                    "Filters Reset";

                setTimeout(function () {

                    resetFilters.textContent =
                        "Reset Filters";

                }, 1200);

            }
        );

    }


    /* ---------------------------------------------------------
       FILTER CHIP HOVER
    --------------------------------------------------------- */

    activeFilters.addEventListener(
        "click",
        function (event) {

            const chip =
                event.target.closest(
                    ".filter-chip"
                );

            if (!chip) {
                return;
            }

            chip.style.transform =
                "scale(.95)";

            setTimeout(function () {

                chip.style.transform = "";

            }, 180);

        }
    );


    /* ---------------------------------------------------------
       METRIC CARD INTERACTION
    --------------------------------------------------------- */

    const metrics =
        exploreData.querySelectorAll(
            ".explore-metric"
        );

    metrics.forEach(function (metric) {

        metric.addEventListener(
            "mouseenter",
            function () {

                const value =
                    metric.querySelector(
                        "strong"
                    );

                if (value) {

                    value.style.transform =
                        "translateX(3px)";

                }

            }
        );


        metric.addEventListener(
            "mouseleave",
            function () {

                const value =
                    metric.querySelector(
                        "strong"
                    );

                if (value) {
                    value.style.transform = "";
                }

            }
        );

    });
    /* ---------------------------------------------------------
       SELECT VISUAL FEEDBACK
    --------------------------------------------------------- */

    filterControls.forEach(function (control) {

        if (!control) {
            return;
        }

        control.addEventListener(
            "focus",
            function () {

                control.parentElement.classList.add(
                    "select-focused"
                );

            }
        );


        control.addEventListener(
            "blur",
            function () {

                control.parentElement.classList.remove(
                    "select-focused"
                );

            }
        );

    });


    /* ---------------------------------------------------------
       INITIAL ACTIVE FILTERS
    --------------------------------------------------------- */

    updateActiveFilters();


    console.log(
        "FINEXA Part 4 explore controls ready"
    );

});
/* =========================================================
   FINAL PART — CTA + BRANDING JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const finalSection =
        document.getElementById("finalFinexa");

    if (!finalSection) {
        return;
    }

    const finalContent =
        finalSection.querySelector(".final-content");

    const finalBranding =
        finalSection.querySelector(".final-branding");

    const finalAction =
        finalSection.querySelector(".final-action");

    const finalLogo =
        finalSection.querySelector(".final-logo");


    /* ---------------------------------------------------------
       FINAL SECTION REVEAL
    --------------------------------------------------------- */

    const finalObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        finalSection.classList.add(
                            "final-visible"
                        );

                        animateFinalSection();

                        finalObserver.unobserve(
                            finalSection
                        );
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    finalObserver.observe(finalSection);


    function animateFinalSection() {

        if (finalContent) {

            finalContent.style.opacity = "0";
            finalContent.style.transform =
                "translateY(40px)";

            setTimeout(function () {

                finalContent.style.opacity = "1";
                finalContent.style.transform =
                    "translateY(0)";

            }, 150);

        }


        if (finalBranding) {

            finalBranding.style.opacity = "0";
            finalBranding.style.transform =
                "translateY(35px)";

            setTimeout(function () {

                finalBranding.style.opacity = "1";
                finalBranding.style.transform =
                    "translateY(0)";

            }, 650);

        }

    }


    /* ---------------------------------------------------------
       CTA BUTTON INTERACTION
    --------------------------------------------------------- */

    if (finalAction) {

        finalAction.addEventListener(
            "mouseenter",
            function () {

                finalAction.style.transform =
                    "translateY(-5px) scale(1.015)";

            }
        );


        finalAction.addEventListener(
            "mouseleave",
            function () {

                finalAction.style.transform = "";

            }
        );


        finalAction.addEventListener(
            "click",
            function (event) {

                const target =
                    document.getElementById(
                        "uploadArea"
                    );

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    setTimeout(function () {

                        const browseButton =
                            document.getElementById(
                                "browseButton"
                            );

                        if (browseButton) {
                            browseButton.focus();
                        }

                    }, 700);

                }

            }
        );

    }


    /* ---------------------------------------------------------
       LOGO INTERACTION
    --------------------------------------------------------- */

    if (finalLogo) {

        finalLogo.addEventListener(
            "mouseenter",
            function () {

                finalLogo.style.transform =
                    "translateY(-5px) rotate(-3deg) scale(1.04)";
                    }
        );


        finalLogo.addEventListener(
            "mouseleave",
            function () {

                finalLogo.style.transform = "";

            }
        );

    }


    /* ---------------------------------------------------------
       SUBTLE BACKGROUND PARALLAX
    --------------------------------------------------------- */

    if (window.innerWidth > 850) {

        finalSection.addEventListener(
            "mousemove",
            function (event) {

                const orbOne =
                    finalSection.querySelector(
                        ".orb-one"
                    );

                const orbTwo =
                    finalSection.querySelector(
                        ".orb-two"
                    );

                if (!orbOne || !orbTwo) {
                    return;
                }

                const rect =
                    finalSection.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;


                orbOne.style.transform =
                    `translate(${x * 25}px, ${y * 18}px)`;


                orbTwo.style.transform =
                    `translate(${x * -20}px, ${y * -15}px)`;

            }
        );


        finalSection.addEventListener(
            "mouseleave",
            function () {

                const orbOne =
                    finalSection.querySelector(
                        ".orb-one"
                    );

                const orbTwo =
                    finalSection.querySelector(
                        ".orb-two"
                    );

                if (orbOne) {
                    orbOne.style.transform = "";
                }

                if (orbTwo) {
                    orbTwo.style.transform = "";
                }

            }
        );

    }


    /* ---------------------------------------------------------
       BRANDING HOVER
    --------------------------------------------------------- */

    const brandDetails =
        finalSection.querySelector(
            ".brand-details"
        );

    if (brandDetails) {

        brandDetails.addEventListener(
            "mouseenter",
            function () {

                brandDetails.style.transform =
                    "translateX(4px)";

            }
        );


        brandDetails.addEventListener(
            "mouseleave",
            function () {

                brandDetails.style.transform = "";

            }
        );

    }


    /* ---------------------------------------------------------
       FOUNDER NAME EFFECT
    --------------------------------------------------------- */

    const founderName =
        finalSection.querySelector(
            ".founder-block strong"
        );

    if (founderName) {

        founderName.addEventListener(
            "mouseenter",
            function () {

                founderName.style.transform =
                    "translateX(4px)";

            }
        );


        founderName.addEventListener(
            "mouseleave",
            function () {

                founderName.style.transform = "";

            }
        );

    }


    console.log(
        "FINEXA final CTA and branding ready"
    );

});
