/* =========================================================
   FINEXA — INDEX.JS
   PART 1
   Navbar + Hero Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    document.body.classList.add("finexa-page-ready");


    /* =====================================================
       NAVBAR SCROLL EFFECT
       ===================================================== */

    const navbar = document.querySelector(".finexa-navbar");

    if (navbar) {

        const updateNavbar = () => {

            if (window.scrollY > 25) {

                navbar.classList.add("navbar-scrolled");

            } else {

                navbar.classList.remove("navbar-scrolled");

            }

        };


        updateNavbar();


        window.addEventListener(
            "scroll",
            updateNavbar,
            { passive: true }
        );

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            navItems.forEach((nav) => {

                nav.classList.remove("active");

            });


            item.classList.add("active");

        });

    });


    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       HERO BUTTON INTERACTION
       ===================================================== */

    const heroButtons =
        document.querySelectorAll(
            ".hero-button"
        );


    heroButtons.forEach((button) => {

        button.addEventListener(
            "mouseenter",
            () => {

                button.classList.add(
                    "button-hover"
                );

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.classList.remove(
                    "button-hover"
                );

            }
        );


        button.addEventListener(
            "mousedown",
            () => {

                button.classList.add(
                    "button-pressed"
                );

            }
        );


        button.addEventListener(
            "mouseup",
            () => {

                button.classList.remove(
                    "button-pressed"
                );

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.classList.remove(
                    "button-pressed"
                );

            }
        );

    });

    /* =====================================================
   WATCH DEMO BUTTON
   ===================================================== */

const demoButton =
    document.querySelector(".demo-button");

if (demoButton) {

    demoButton.addEventListener("click", (event) => {

        event.preventDefault();

        window.location.href = "/demo";

    });

}


    /* =====================================================
       GET STARTED BUTTON
       ===================================================== */

    const startButton =
        document.querySelector(
            ".start-button"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            () => {

                startButton.classList.add(
                    "start-clicked"
                );


                window.setTimeout(() => {

                    startButton.classList.remove(
                        "start-clicked"
                    );

                }, 500);

            }
        );

    }


    /* =====================================================
       HERO BUTTON KEYBOARD ACCESSIBILITY
       ===================================================== */

    heroButtons.forEach((button) => {

        button.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    button.classList.add(
                        "button-keyboard-active"
                    );

                }

            }
        );


        button.addEventListener(
            "keyup",
            () => {

                button.classList.remove(
                    "button-keyboard-active"
                );

            }
        );

    });


    /* =====================================================
       HERO PARALLAX
       ===================================================== */

    const heroContent =
        document.querySelector(
            ".hero-content"
        );


    if (
        heroContent &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        window.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    (event.clientX /
                        window.innerWidth) - 0.5;


                const y =
                    (event.clientY /
                        window.innerHeight) - 0.5;


                heroContent.style.setProperty(
                    "--mouse-x",
                   '${x * 6}px'
                );


                heroContent.style.setProperty(
                    "--mouse-y",
                    '${y * 4}px'
                );

            },
            { passive: true }
        );

    }


    /* =====================================================
       HERO VISIBILITY
       ===================================================== */

    const heroSection =
        document.querySelector(
            ".hero-section"
        );


    if (
        heroSection &&
        "IntersectionObserver" in window
    ) {

        const heroObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            heroSection.classList.add(
                                "hero-visible"
                            );

                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


        heroObserver.observe(
            heroSection
        );

    }


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {
        document.body.classList.add(
            "reduced-motion"
        );

    }


    /* =====================================================
       RESIZE HANDLING
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                window.setTimeout(() => {

                    document.body.classList.add(
                        "layout-updated"
                    );


                    window.setTimeout(() => {

                        document.body.classList.remove(
                            "layout-updated"
                        );

                    }, 150);

                }, 150);

        },
        { passive: true }
    );


    /* =====================================================
       PAGE READY
       ===================================================== */

    document.body.classList.add(
        "finexa-index-loaded"
    );


    console.log(
        "FINEXA Index — Part 1 loaded successfully."
    );

});
/* =========================================================
   FINEXA — INDEX.JS
   PART 2
   Intelligence Showcase Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ANALYTICS CARD 3D MOUSE TILT
       ===================================================== */

    const analyticsStage =
        document.querySelector(".analytics-stage");

    const analyticsCard =
        document.querySelector(".analytics-card");


    if (
        analyticsStage &&
        analyticsCard &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        analyticsStage.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    analyticsStage.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;


                const rotateY = x * 7;
                const rotateX = y * -6;


                analyticsCard.style.transform =
                    `rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            },
            { passive: true }
        );


        analyticsStage.addEventListener(
            "mouseleave",
            () => {

                analyticsCard.style.transform =
                    "rotateX(5deg) rotateY(-3deg)";

            }
        );

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const intelligenceSection =
        document.querySelector(
            ".intelligence-section"
        );


    if (
        intelligenceSection &&
        "IntersectionObserver" in window
    ) {

        const intelligenceObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            intelligenceSection.classList.add(
                                "intelligence-visible"
                            );

                            intelligenceObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.18
                }
            );


        intelligenceObserver.observe(
            intelligenceSection
        );

    }


    /* =====================================================
       FLOATING DATA PARALLAX
       ===================================================== */

    const floatingData =
        document.querySelectorAll(
            ".floating-data"
        );


    if (
        floatingData.length &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        window.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    (event.clientX /
                        window.innerWidth) - 0.5;

                const y =
                    (event.clientY /
                        window.innerHeight) - 0.5;


                floatingData.forEach(
                    (element, index) => {

                        const depth =
                            (index + 1) * 7;


                        element.style.setProperty(
                            "--parallax-x",
                            `${x * depth}px`
                        );


                        element.style.setProperty(
                            "--parallax-y",
                            `${y * depth}px`
                        );

                    }
                );

            },
            { passive: true }
        );

    }
    /* =====================================================
       ANALYTICS KPI HOVER
       ===================================================== */

    const kpis =
        document.querySelectorAll(
            ".analytics-kpi"
        );


    kpis.forEach((kpi) => {

        kpi.addEventListener(
            "mouseenter",
            () => {

                kpis.forEach((item) => {

                    if (item !== kpi) {
                        item.classList.add(
                            "kpi-dimmed"
                        );
                    }

                });


                kpi.classList.add(
                    "kpi-highlighted"
                );

            }
        );


        kpi.addEventListener(
            "mouseleave",
            () => {

                kpis.forEach((item) => {

                    item.classList.remove(
                        "kpi-dimmed"
                    );

                    item.classList.remove(
                        "kpi-highlighted"
                    );

                });

            }
        );

    });


    /* =====================================================
       VALUE ITEMS INTERACTION
       ===================================================== */

    const valueItems =
        document.querySelectorAll(
            ".value-item"
        );


    valueItems.forEach((item) => {

        item.addEventListener(
            "mouseenter",
            () => {

                item.classList.add(
                    "value-active"
                );

            }
        );


        item.addEventListener(
            "mouseleave",
            () => {

                item.classList.remove(
                    "value-active"
                );

            }
        );

    });


    /* =====================================================
       CHART TOOLTIP MICRO ANIMATION
       ===================================================== */

    const chartTooltip =
        document.querySelector(
            ".chart-tooltip"
        );


    if (chartTooltip) {

        let tooltipTimer;


        const animateTooltip = () => {

            chartTooltip.classList.add(
                "tooltip-active"
            );


            clearTimeout(tooltipTimer);


            tooltipTimer =
                window.setTimeout(() => {

                    chartTooltip.classList.remove(
                        "tooltip-active"
                    );

                }, 900);

        };


        window.setTimeout(
            animateTooltip,
            1800
        );


        window.setInterval(
            animateTooltip,
            5000
        );

    }


    /* =====================================================
       SECTION LABEL INTERACTION
       ===================================================== */

    const sectionLabel =
        document.querySelector(
            ".section-label"
        );


    if (sectionLabel) {

        sectionLabel.addEventListener(
            "mouseenter",
            () => {

                sectionLabel.classList.add(
                    "label-active"
                );

            }
        );


        sectionLabel.addEventListener(
            "mouseleave",
            () => {

                sectionLabel.classList.remove(
                    "label-active"
                );

            }
        );

    }


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        if (analyticsCard) {

            analyticsCard.style.transform =
                "none";

        }


        floatingData.forEach((element) => {

            element.style.transform =
                "none";

        });

    }


    /* =====================================================
       PART 2 READY
       ===================================================== */
       document.body.classList.add(
        "finexa-part2-loaded"
    );


    console.log(
        "FINEXA Index — Part 2 loaded successfully."
    );

});
/* =========================================================
   FINEXA — INDEX.JS
   PART 3
   Core Capabilities Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       CAPABILITY CARDS
       ===================================================== */

    const capabilityCards =
        document.querySelectorAll(
            ".capability-card"
        );


    capabilityCards.forEach((card) => {

        card.addEventListener(
            "mouseenter",
            () => {

                capabilityCards.forEach((item) => {

                    if (item !== card) {

                        item.classList.add(
                            "capability-dimmed"
                        );

                    }

                });


                card.classList.add(
                    "capability-active"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                capabilityCards.forEach((item) => {

                    item.classList.remove(
                        "capability-dimmed"
                    );

                    item.classList.remove(
                        "capability-active"
                    );

                });

            }
        );

    });


    /* =====================================================
       CARD 3D MOUSE MOVEMENT
       ===================================================== */

    if (
        capabilityCards.length &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        capabilityCards.forEach((card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        (event.clientX - rect.left) /
                        rect.width - 0.5;


                    const y =
                        (event.clientY - rect.top) /
                        rect.height - 0.5;


                    const rotateX =
                        y * -3;


                    const rotateY =
                        x * 4;


                    card.style.transform =
                        `translateY(-10px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)`;

                },
                { passive: true }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const capabilitiesSection =
        document.querySelector(
            ".capabilities-section"
        );


    if (
        capabilitiesSection &&
        "IntersectionObserver" in window
    ) {

        const capabilitiesObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            capabilitiesSection.classList.add(
                                "capabilities-visible"
                            );


                            capabilityCards.forEach(
                                (card, index) => {

                                    card.style.setProperty(
                                        "--card-index",
                                        index
                                    );

                                }
                            );


                            capabilitiesObserver.unobserve(
                                entry.target
                            );

                        }
                        });

                },
                {
                    threshold: 0.15
                }
            );


        capabilitiesObserver.observe(
            capabilitiesSection
        );

    }


    /* =====================================================
       MINI CHART INTERACTION
       ===================================================== */

    const miniCharts =
        document.querySelectorAll(
            ".mini-chart"
        );


    miniCharts.forEach((chart) => {

        chart.addEventListener(
            "mouseenter",
            () => {

                chart.classList.add(
                    "chart-active"
                );

            }
        );


        chart.addEventListener(
            "mouseleave",
            () => {

                chart.classList.remove(
                    "chart-active"
                );

            }
        );

    });


    /* =====================================================
       MINI BAR INTERACTION
       ===================================================== */

    const miniBars =
        document.querySelectorAll(
            ".mini-bars"
        );


    miniBars.forEach((bars) => {

        bars.addEventListener(
            "mouseenter",
            () => {

                bars.classList.add(
                    "bars-active"
                );

            }
        );


        bars.addEventListener(
            "mouseleave",
            () => {

                bars.classList.remove(
                    "bars-active"
                );

            }
        );

    });


    /* =====================================================
       HEALTH RING INTERACTION
       ===================================================== */

    const healthRing =
        document.querySelector(
            ".health-ring"
        );


    if (healthRing) {

        healthRing.addEventListener(
            "mouseenter",
            () => {

                healthRing.classList.add(
                    "health-active"
                );

            }
        );


        healthRing.addEventListener(
            "mouseleave",
            () => {

                healthRing.classList.remove(
                    "health-active"
                );

            }
        );

    }


    /* =====================================================
       DECISION ORBIT INTERACTION
       ===================================================== */

    const decisionOrbit =
        document.querySelector(
            ".decision-orbit"
        );


    if (
        decisionOrbit &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        decisionOrbit.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    decisionOrbit.getBoundingClientRect();


                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;


                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;


                decisionOrbit.style.transform =
                    translate(
                        `${x * 8}px`,
                        `${y * 8}px`
                    );

            },
            { passive: true }
        );


        decisionOrbit.addEventListener(
            "mouseleave",
            () => {

                decisionOrbit.style.transform =
                    "";

            }
        );

    }


    /* =====================================================
       VALUE / FOOTER ANIMATION
       ===================================================== */

    const capabilitiesFooter =
        document.querySelector(
            ".capabilities-footer"
        );


    if (
        capabilitiesFooter &&
        "IntersectionObserver" in window
    ) {

        const footerObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {
                    if (
                            entry.isIntersecting
                        ) {

                            capabilitiesFooter.classList.add(
                                "footer-visible"
                            );

                            footerObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );


        footerObserver.observe(
            capabilitiesFooter
        );

    }


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        capabilityCards.forEach((card) => {

            card.style.transform = "none";

        });


        if (decisionOrbit) {

            decisionOrbit.style.transform =
                "none";

        }

    }


    /* =====================================================
       PART 3 READY
       ===================================================== */

    document.body.classList.add(
        "finexa-part3-loaded"
    );


    console.log(
        "FINEXA Index — Part 3 loaded successfully."
    );

});
// =====================================================
// FINEXA WORKFLOW — PART 4 JS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const workflowSection = document.querySelector(".workflow-section");
    const workflowSteps = document.querySelectorAll(".workflow-step");
    const workflowConnectors = document.querySelectorAll(".workflow-connector");
    const workflowBottom = document.querySelector(".workflow-bottom");


    /* =========================
       WORKFLOW REVEAL
       ========================= */

    if (workflowSection && "IntersectionObserver" in window) {

        const workflowObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    workflowSection.classList.add("workflow-visible");

                    workflowSteps.forEach((step, index) => {

                        setTimeout(() => {
                            step.classList.add("workflow-step-visible");
                        }, index * 180);

                    });

                    workflowConnectors.forEach((connector, index) => {

                        setTimeout(() => {
                            connector.classList.add("workflow-connector-visible");
                        }, 250 + index * 180);

                    });

                    if (workflowBottom) {

                        setTimeout(() => {
                            workflowBottom.classList.add(
                                "workflow-bottom-visible"
                            );
                        }, 700);

                    }

                    workflowObserver.unobserve(entry.target);
                });

            },
            {
                threshold: 0.18
            }
        );

        workflowObserver.observe(workflowSection);
    }


    /* =========================
       CARD 3D TILT
       ========================= */

    workflowSteps.forEach((step) => {

        step.addEventListener("mousemove", (event) => {

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            const rect = step.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -3;

            const rotateY =
                ((x - centerX) / centerX) * 3;

            step.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;
        });


        step.addEventListener("mouseleave", () => {

            step.style.transform = "";

        });

    });


    /* =========================
       ACTIVE STEP HIGHLIGHT
       ========================= */

    workflowSteps.forEach((step) => {

        step.addEventListener("mouseenter", () => {

            workflowSteps.forEach((otherStep) => {

                if (otherStep !== step) {
                    otherStep.classList.add(
                        "workflow-step-dim"
                    );
                }

            });

        });


        step.addEventListener("mouseleave", () => {

            workflowSteps.forEach((otherStep) => {

                otherStep.classList.remove(
                    "workflow-step-dim"
                );

            });

        });

    });


    /* =========================
       UPLOAD INTERACTION
       ========================= */

    const uploadVisual =
        document.querySelector(".upload-visual");

    if (uploadVisual) {

        uploadVisual.addEventListener("mouseenter", () => {

            uploadVisual.classList.add(
                "upload-active"
            );

        });
        uploadVisual.addEventListener("mouseleave", () => {

            uploadVisual.classList.remove(
                "upload-active"
            );

        });

    }


    /* =========================
       ANALYSIS INTERACTION
       ========================= */

    const analyzeVisual =
        document.querySelector(".analyze-visual");

    if (analyzeVisual) {

        analyzeVisual.addEventListener("mouseenter", () => {

            analyzeVisual.classList.add(
                "analysis-active"
            );

        });


        analyzeVisual.addEventListener("mouseleave", () => {

            analyzeVisual.classList.remove(
                "analysis-active"
            );

        });

    }


    /* =========================
       DECISION INTERACTION
       ========================= */

    const decisionVisual =
        document.querySelector(".decision-visual");

    if (decisionVisual) {

        decisionVisual.addEventListener("mouseenter", () => {

            decisionVisual.classList.add(
                "decision-active"
            );

        });


        decisionVisual.addEventListener("mouseleave", () => {

            decisionVisual.classList.remove(
                "decision-active"
            );

        });

    }


    /* =========================
       PARALLAX VISUALS
       ========================= */

    workflowSteps.forEach((step) => {

        const visual =
            step.querySelector(".workflow-visual");

        if (!visual) return;


        step.addEventListener("mousemove", (event) => {

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            const rect = step.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;


            visual.style.transform =
                `translate(${x * 5}px, ${y * 5}px)`;
        });


        step.addEventListener("mouseleave", () => {

            visual.style.transform = "";

        });

    });


    /* =========================
       CONNECTOR FLOW EFFECT
       ========================= */

    workflowConnectors.forEach((connector) => {

        connector.addEventListener("mouseenter", () => {

            connector.classList.add(
                "connector-active"
            );

        });


        connector.addEventListener("mouseleave", () => {

            connector.classList.remove(
                "connector-active"
            );

        });

    });


    /* =========================
       BOTTOM FLOW INTERACTION
       ========================= */

    if (workflowBottom) {

        workflowBottom.addEventListener("mouseenter", () => {

            workflowBottom.classList.add(
                "workflow-bottom-active"
            );

        });


        workflowBottom.addEventListener("mouseleave", () => {

            workflowBottom.classList.remove(
                "workflow-bottom-active"
            );

        });

    }


    /* =========================
       KEYBOARD ACCESSIBILITY
       ========================= */

    workflowSteps.forEach((step) => {

        step.setAttribute("tabindex", "0");


        step.addEventListener("focus", () => {

            step.classList.add(
                "workflow-step-focus"
            );

        });


        step.addEventListener("blur", () => {

            step.classList.remove(
                "workflow-step-focus"
            );

        });

    });


    /* =========================
       REDUCED MOTION
       ========================= */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        workflowSection?.classList.add(
            "reduced-motion"
        );

    }
    /* =========================
       LOAD MESSAGE
       ========================= */

    console.log(
        "FINEXA Part 4 — Workflow interactions loaded."
    );

});


// =====================================================
// END OF FINEXA PART 4 JS
// =====================================================
// =====================================================
// FINEXA INTELLIGENCE PREVIEW — PART 5 JS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const insightSection =
        document.querySelector(".insight-section");

    const insightSummary =
        document.querySelector(".insight-summary");

    const insightAnalysis =
        document.querySelector(".insight-analysis");

    const signalRows =
        document.querySelectorAll(".signal-row");

    const signalCore =
        document.querySelector(".signal-core");

    const confidenceBar =
        document.querySelector(".confidence-track span");

    const bottomFlow =
        document.querySelector(".insight-bottom");


    /* =========================
       SECTION REVEAL
       ========================= */

    if (
        insightSection &&
        "IntersectionObserver" in window
    ) {

        const insightObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        insightSection.classList.add(
                            "insight-visible"
                        );

                        if (insightSummary) {
                            insightSummary.classList.add(
                                "insight-summary-visible"
                            );
                        }

                        if (insightAnalysis) {
                            insightAnalysis.classList.add(
                                "insight-analysis-visible"
                            );
                        }

                        signalRows.forEach((row, index) => {

                            setTimeout(() => {

                                row.classList.add(
                                    "signal-row-visible"
                                );

                            }, 180 + index * 120);

                        });

                        if (bottomFlow) {

                            setTimeout(() => {

                                bottomFlow.classList.add(
                                    "insight-bottom-visible"
                                );

                            }, 750);

                        }

                        insightObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.18
                }
            );

        insightObserver.observe(insightSection);

    }


    /* =========================
       SUMMARY CARD TILT
       ========================= */

    if (insightSummary) {

        insightSummary.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    insightSummary.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -3;

                const rotateY =
                    ((x - centerX) / centerX) * 3;

                insightSummary.style.transform =
                    `perspective(1100px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-8px)`;

            }
        );


        insightSummary.addEventListener(
            "mouseleave",
            () => {
            insightSummary.style.transform = "";

            }
        );

    }


    /* =========================
       ANALYSIS CARD TILT
       ========================= */

    if (insightAnalysis) {

        insightAnalysis.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    insightAnalysis.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -2.5;

                const rotateY =
                    ((x - centerX) / centerX) * 2.5;

                insightAnalysis.style.transform =
                    `perspective(1100px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-8px)`;

            }
        );


        insightAnalysis.addEventListener(
            "mouseleave",
            () => {

                insightAnalysis.style.transform = "";

            }
        );

    }


    /* =========================
       SIGNAL ROW INTERACTION
       ========================= */

    signalRows.forEach((row) => {

        row.addEventListener(
            "mouseenter",
            () => {

                signalRows.forEach((otherRow) => {

                    if (otherRow !== row) {

                        otherRow.classList.add(
                            "signal-row-dim"
                        );

                    }

                });

            }
        );


        row.addEventListener(
            "mouseleave",
            () => {

                signalRows.forEach((otherRow) => {

                    otherRow.classList.remove(
                        "signal-row-dim"
                    );

                });

            }
        );

    });


    /* =========================
       SIGNAL CORE INTERACTION
       ========================= */

    if (signalCore) {

        signalCore.addEventListener(
            "mouseenter",
            () => {

                signalCore.classList.add(
                    "signal-core-active"
                );

            }
        );


        signalCore.addEventListener(
            "mouseleave",
            () => {

                signalCore.classList.remove(
                    "signal-core-active"
                );

            }
        );

    }


    /* =========================
       CONFIDENCE BAR INTERACTION
       ========================= */

    if (confidenceBar) {

        confidenceBar.addEventListener(
            "mouseenter",
            () => {

                confidenceBar.classList.add(
                    "confidence-active"
                );

            }
        );


        confidenceBar.addEventListener(
            "mouseleave",
            () => {

                confidenceBar.classList.remove(
                    "confidence-active"
                );

            }
        );

    }


    /* =========================
       KEYBOARD ACCESSIBILITY
       ========================= */

    signalRows.forEach((row) => {

        row.setAttribute("tabindex", "0");

        row.addEventListener(
            "focus",
            () => {

                row.classList.add(
                    "signal-row-focus"
                );

            }
        );


        row.addEventListener(
            "blur",
            () => {

                row.classList.remove(
                    "signal-row-focus"
                );

            }
        );

    });
    /* =========================
       MOUSE PARALLAX
       ========================= */

    if (insightSection) {

        insightSection.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    insightSection.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;

                if (signalCore) {

                    signalCore.style.setProperty(
                        "--signal-x",
                        `${x * 8}px`
                    );

                    signalCore.style.setProperty(
                        "--signal-y",
                        `${y * 8}px`
                    );

                }

            }
        );

    }


    /* =========================
       REDUCED MOTION
       ========================= */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        insightSection?.classList.add(
            "reduced-motion"
        );

    }


    /* =========================
       LOAD MESSAGE
       ========================= */

    console.log(
        "FINEXA Part 5 — Intelligence interactions loaded."
    );

});


// =====================================================
// END OF FINEXA PART 5 JS
// =====================================================
/* =====================================================
   FINEXA FINAL BRANDING — PART 6 JS
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const footer = document.querySelector(".finexa-footer");
    const footerLogo = document.querySelector(".footer-logo");
    const footerLinks = document.querySelectorAll(".footer-column a");
    const footerSignature = document.querySelector(".footer-signature");


    /* -------------------------------------------------
       FOOTER REVEAL
       ------------------------------------------------- */

    if (footer) {

        const footerObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        footer.classList.add("footer-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        footerObserver.observe(footer);
    }


    /* -------------------------------------------------
       LOGO INTERACTION
       ------------------------------------------------- */

    if (footerLogo) {

        footerLogo.addEventListener("mouseenter", () => {

            footerLogo.classList.add("footer-logo-active");

        });

        footerLogo.addEventListener("mouseleave", () => {

            footerLogo.classList.remove("footer-logo-active");

        });

        footerLogo.addEventListener("click", () => {

            footerLogo.classList.remove("footer-logo-active");

            void footerLogo.offsetWidth;

            footerLogo.classList.add("footer-logo-active");

        });

    }


    /* -------------------------------------------------
       FOOTER LINK INTERACTION
       ------------------------------------------------- */

    footerLinks.forEach((link) => {

        link.addEventListener("mouseenter", () => {

            footerLinks.forEach((otherLink) => {

                if (otherLink !== link) {

                    otherLink.classList.add("footer-link-dim");

                }

            });

        });


        link.addEventListener("mouseleave", () => {

            footerLinks.forEach((otherLink) => {

                otherLink.classList.remove("footer-link-dim");

            });

        });


        /* Keyboard accessibility */

        link.addEventListener("focus", () => {

            link.classList.add("footer-link-focus");

        });


        link.addEventListener("blur", () => {

            link.classList.remove("footer-link-focus");

        });

    });


    /* -------------------------------------------------
       LEADERSHIP SIGNATURE INTERACTION
       ------------------------------------------------- */

    if (footerSignature) {

        footerSignature.addEventListener("mouseenter", () => {

            footerSignature.classList.add("signature-active");

        });

        footerSignature.addEventListener("mouseleave", () => {

            footerSignature.classList.remove("signature-active");

        });

    }


    /* -------------------------------------------------
       SMOOTH INTERNAL FOOTER NAVIGATION
       ------------------------------------------------- */

    footerLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const target = link.getAttribute("href");

            if (!target || !target.startsWith("#")) {
                return;
            }

            const section = document.querySelector(target);

            if (!section) {
                return;
            }

            event.preventDefault();

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* -------------------------------------------------
       REDUCED MOTION SUPPORT
       ------------------------------------------------- */
       const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches && footer) {

        footer.classList.add("footer-visible");

    }


    /* -------------------------------------------------
       CONSOLE STATUS
       ------------------------------------------------- */

    console.log(
        "FINEXA Part 6 loaded — Final branding active."
    );

});


/* =====================================================
   END OF FINEXA PART 6 JS
   ===================================================== */
