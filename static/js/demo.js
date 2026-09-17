document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* ============================================================
       INITIALIZATION
       ============================================================ */

    document.body.classList.add("dashboard-ready");


    /* ============================================================
       NAVIGATION
       ============================================================ */

    const navLinks =
        document.querySelectorAll(
            ".dashboard-nav-link"
        );

    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );


    const updateNavigation = () => {

        let currentSection = "overview";

        sections.forEach((section) => {

            const sectionTop =
                section.getBoundingClientRect().top;

            if (sectionTop <= 180) {
                currentSection =
                    section.getAttribute("id");
            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {
                link.classList.add("active");
            }

        });

    };


    window.addEventListener(
        "scroll",
        updateNavigation,
        { passive: true }
    );


    updateNavigation();


    /* ============================================================
       SMOOTH NAVIGATION
       ============================================================ */

    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const target =
                    link.getAttribute("href");

                if (
                    !target ||
                    !target.startsWith("#")
                ) {
                    return;
                }


                const section =
                    document.querySelector(target);


                if (!section) {
                    return;
                }


                event.preventDefault();


                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* ============================================================
       PERIOD SELECTOR
       ============================================================ */

    const periodButtons =
        document.querySelectorAll(
            ".period-selector button"
        );


    periodButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                periodButtons.forEach(
                    (otherButton) => {

                        otherButton.classList.remove(
                            "period-active"
                        );

                    }
                );


                button.classList.add(
                    "period-active"
                );


                button.classList.remove(
                    "period-clicked"
                );

                void button.offsetWidth;

                button.classList.add(
                    "period-clicked"
                );

            }
        );

    });


    /* ============================================================
       KPI CARD INTERACTION
       ============================================================ */

    const kpiCards =
        document.querySelectorAll(
            ".dashboard-kpi-card"
        );


    kpiCards.forEach((card) => {

        card.addEventListener(
            "mouseenter",
            () => {

                kpiCards.forEach(
                    (otherCard) => {

                        if (otherCard !== card) {

                            otherCard.style.opacity =
                                "0.58";

                        }

                    }
                );

            }
        );
        card.addEventListener(
            "mouseleave",
            () => {

                kpiCards.forEach(
                    (otherCard) => {

                        otherCard.style.opacity =
                            "";

                    }
                );

            }
        );


        card.addEventListener(
            "click",
            () => {

                card.classList.remove(
                    "kpi-active"
                );

                void card.offsetWidth;

                card.classList.add(
                    "kpi-active"
                );

            }
        );

    });


    /* ============================================================
       KPI 3D TILT
       ============================================================ */

    kpiCards.forEach((card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                if (window.innerWidth < 900) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) /
                        centerY) * -1.4;


                const rotateY =
                    ((x - centerX) /
                        centerX) * 1.4;


                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-4px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";

            }
        );

    });


    /* ============================================================
       HEALTH PROGRESS
       ============================================================ */

    const healthProgress =
        document.querySelector(
            ".health-progress span"
        );


    if (healthProgress) {

        const healthObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            healthProgress.style.width =
                                "0%";


                            requestAnimationFrame(
                                () => {

                                    setTimeout(
                                        () => {

                                            healthProgress.style.width =
                                                "87%";

                                        },
                                        180
                                    );

                                }
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );


        healthObserver.observe(
            healthProgress
        );

    }


    /* ============================================================
       SUMMARY ITEM INTERACTION
       ============================================================ */

    const summaryItems =
        document.querySelectorAll(
            ".summary-item"
        );


    summaryItems.forEach((item) => {

        item.addEventListener(
            "mouseenter",
            () => {

                summaryItems.forEach(
                    (otherItem) => {
                    if (
                            otherItem !== item
                        ) {

                            otherItem.style.opacity =
                                "0.45";

                        }

                    }
                );

                item.style.transform =
                    "translateY(-2px)";

                item.style.transition =
                    "transform 0.25s ease, opacity 0.25s ease";

            }
        );


        item.addEventListener(
            "mouseleave",
            () => {

                summaryItems.forEach(
                    (otherItem) => {

                        otherItem.style.opacity =
                            "";

                    }
                );

                item.style.transform = "";

            }
        );

    });


    /* ============================================================
       LIVE STATUS INTERACTION
       ============================================================ */

    const liveStatus =
        document.querySelector(
            ".dashboard-live"
        );


    if (liveStatus) {

        liveStatus.addEventListener(
            "mouseenter",
            () => {

                liveStatus.style.transform =
                    "translateY(-2px)";

            }
        );


        liveStatus.addEventListener(
            "mouseleave",
            () => {

                liveStatus.style.transform = "";

            }
        );

    }


    /* ============================================================
       PROFILE INTERACTION
       ============================================================ */

    const profile =
        document.querySelector(
            ".dashboard-profile"
        );


    if (profile) {

        profile.addEventListener(
            "click",
            () => {

                profile.classList.remove(
                    "profile-active"
                );

                void profile.offsetWidth;

                profile.classList.add(
                    "profile-active"
                );

            }
        );

    }


    /* ============================================================
       MOUSE ATMOSPHERE
       ============================================================ */

    const dashboardMain =
        document.querySelector(
            ".dashboard-main"
        );


    if (
        dashboardMain &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        dashboardMain.addEventListener(
            "mousemove",
            (event) => {

                if (window.innerWidth < 900) {
                    return;
                }


                const x =
                    (event.clientX /
                        window.innerWidth) - 0.5;


                const y =
                    (event.clientY /
                        window.innerHeight) - 0.5;


                document.documentElement.style.setProperty(
                    "--dashboard-mouse-x",
                    `${x * 12}px`
                );


                document.documentElement.style.setProperty(
                    "--dashboard-mouse-y",
                    `${y * 8}px`
                );

            },
            { passive: true }
        );

    }


    /* ============================================================
       KEYBOARD ACCESSIBILITY
       ============================================================ */

    navLinks.forEach((link) => {

        link.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    link.click();

                }

            }
        );

    });


    /* ============================================================
       REDUCED MOTION
       ============================================================ */
       const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        document.documentElement.style.setProperty(
            "--dashboard-transition",
            "none"
        );

    }


    /* ============================================================
       PAGE READY
       ============================================================ */

    document.body.classList.add(
        "dashboard-visible"
    );


    console.log(
        "FINEXA Dashboard — Part 1 loaded successfully."
    );

});
/* ============================================================
   FINEXA DEMO — PART 2
   INTERACTIVE ANALYTICS
   ============================================================ */


/* ============================================================
   ANALYTICS PERIOD SELECTOR
   ============================================================ */

const analyticsPeriodButtons =
    document.querySelectorAll(
        ".analytics-period button"
    );


analyticsPeriodButtons.forEach((button) => {

    button.addEventListener("click", () => {

        analyticsPeriodButtons.forEach(
            (otherButton) => {
                otherButton.classList.remove(
                    "analytics-period-active"
                );
            }
        );


        button.classList.add(
            "analytics-period-active"
        );


        /* Restart chart animations */

        const revenuePath =
            document.querySelector(
                ".revenue-path"
            );

        const expensePath =
            document.querySelector(
                ".expense-path"
            );


        if (revenuePath) {

            revenuePath.style.animation = "none";

            void revenuePath.offsetWidth;

            revenuePath.style.animation =
                "drawRevenue 1.8s ease forwards";

        }


        if (expensePath) {

            expensePath.style.animation = "none";

            void expensePath.offsetWidth;

            expensePath.style.animation =
                "drawExpense 1.8s ease forwards";

        }


        /* Restart monthly bars */

        const monthlyBars =
            document.querySelectorAll(
                ".monthly-bar"
            );


        monthlyBars.forEach((bar, index) => {

            bar.style.animation = "none";

            void bar.offsetWidth;

            bar.style.animation =
                `monthlyBarReveal 0.7s ${index * 0.04}s
                 cubic-bezier(.2,.8,.2,1) both`;

        });

    });

});


/* ============================================================
   ANALYTICS KPI CARDS
   ============================================================ */

const analyticsCards =
    document.querySelectorAll(
        ".analytics-card"
    );


analyticsCards.forEach((card) => {

    card.addEventListener(
        "mouseenter",
        () => {

            analyticsCards.forEach(
                (otherCard) => {

                    if (otherCard !== card) {

                        otherCard.style.opacity =
                            "0.55";

                    }

                }
            );

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            analyticsCards.forEach(
                (otherCard) => {

                    otherCard.style.opacity =
                        "";

                }
            );

        }
    );


    card.addEventListener(
        "click",
        () => {

            card.classList.remove(
                "kpi-active"
            );

            void card.offsetWidth;

            card.classList.add(
                "kpi-active"
            );

        }
    );

});


/* ============================================================
   CHART HOVER POINTS
   ============================================================ */

const chartPoints =
    document.querySelectorAll(
        ".chart-hover-point"
    );


const chartTooltip =
    document.querySelector(
        ".chart-tooltip"
    );


if (chartTooltip) {

    chartPoints.forEach((point) => {

        point.addEventListener(
            "mouseenter",
            () => {

                const month =
                    point.dataset.month;

                const revenue =
                    point.dataset.revenue;

                const expense =
                    point.dataset.expense;


                chartTooltip.innerHTML = `
                    <strong>${month}</strong>

                    <span>
                        Revenue ${revenue}
                    </span>
                    <span>
                        Expenses ${expense}
                    </span>
                `;


                chartTooltip.style.opacity =
                    "1";

                chartTooltip.style.transform =
                    "translateY(0)";

            }
        );


        point.addEventListener(
            "mouseleave",
            () => {

                chartTooltip.style.opacity =
                    "";

                chartTooltip.style.transform =
                    "";

            }
        );

    });

}


/* ============================================================
   MONTHLY BAR INTERACTION
   ============================================================ */

const monthlyColumns =
    document.querySelectorAll(
        ".monthly-column"
    );


monthlyColumns.forEach((column) => {

    column.addEventListener(
        "mouseenter",
        () => {

            monthlyColumns.forEach(
                (otherColumn) => {

                    if (
                        otherColumn !== column
                    ) {

                        otherColumn.style.opacity =
                            "0.4";

                    }

                }
            );

        }
    );


    column.addEventListener(
        "mouseleave",
        () => {

            monthlyColumns.forEach(
                (otherColumn) => {

                    otherColumn.style.opacity =
                        "";

                }
            );

        }
    );

});


/* ============================================================
   PROFIT RING INTERACTION
   ============================================================ */

const profitRing =
    document.querySelector(
        ".profit-ring"
    );


if (profitRing) {

    profitRing.addEventListener(
        "mouseenter",
        () => {

            profitRing.style.transform =
                "scale(1.05)";

        }
    );


    profitRing.addEventListener(
        "mouseleave",
        () => {

            profitRing.style.transform =
                "";

        }
    );

}


/* ============================================================
   ANALYTICS SECTION REVEAL
   ============================================================ */

const analyticsSection =
    document.querySelector(
        ".analytics-section"
    );


if (analyticsSection) {

    const analyticsObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "analytics-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    analyticsObserver.observe(
        analyticsSection
    );

}


/* ============================================================
   ANALYTICS NAVIGATION
   ============================================================ */

const analyticsNav =
    document.querySelector(
        '.dashboard-nav-link[href="#analytics"]'
    );


if (
    analyticsNav &&
    analyticsSection
) {

    analyticsNav.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            analyticsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            document
                .querySelectorAll(
                    ".dashboard-nav-link"
                )
                .forEach((link) => {

                    link.classList.remove(
                        "active"
                    );

                });


            analyticsNav.classList.add(
                "active"
            );

        }
    );

}
/* ============================================================
   ANALYTICS KEYBOARD SUPPORT
   ============================================================ */

analyticsPeriodButtons.forEach(
    (button) => {

        button.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    button.click();

                }

            }
        );

    }
);


/* ============================================================
   ANALYTICS READY
   ============================================================ */

document.body.classList.add(
    "analytics-ready"
);


console.log(
    "FINEXA Dashboard — Part 2 loaded successfully."
);
/* ============================================================
   FINEXA — AUTO HIDE SIDEBAR ON SCROLL
   ============================================================ */

const dashboardSidebar =
    document.querySelector(".dashboard-sidebar");

const dashboardMain =
    document.querySelector(".dashboard-main");

let sidebarTimer = null;
let lastScrollPosition = window.scrollY;
let sidebarHidden = false;


/* ============================================================
   HIDE SIDEBAR
   ============================================================ */

function hideDashboardSidebar() {

    if (!dashboardSidebar || sidebarHidden) {
        return;
    }

    sidebarHidden = true;

    dashboardSidebar.classList.add(
        "sidebar-hidden"
    );

    if (dashboardMain) {

        dashboardMain.classList.add(
            "dashboard-expanded"
        );

    }

}


/* ============================================================
   SHOW SIDEBAR
   ============================================================ */

function showDashboardSidebar() {

    if (!dashboardSidebar || !sidebarHidden) {
        return;
    }

    sidebarHidden = false;

    dashboardSidebar.classList.remove(
        "sidebar-hidden"
    );

    if (dashboardMain) {

        dashboardMain.classList.remove(
            "dashboard-expanded"
        );

    }

}


/* ============================================================
   SCROLL DETECTION
   ============================================================ */

window.addEventListener(
    "scroll",
    () => {

        const currentScroll =
            window.scrollY;


        const scrollDifference =
            currentScroll -
            lastScrollPosition;


        clearTimeout(sidebarTimer);


        /*
         * Scrolling DOWN
         * Wait 1 second, then hide sidebar
         */

        if (
            scrollDifference > 5 &&
            currentScroll > 100
        ) {

            sidebarTimer =
                setTimeout(
                    () => {

                        hideDashboardSidebar();

                    },
                    1000
                );

        }


        /*
         * Scrolling UP
         * Wait 1 second, then show sidebar
         */

        else if (
            scrollDifference < -5
        ) {

            sidebarTimer =
                setTimeout(
                    () => {

                        showDashboardSidebar();

                    },
                    1000
                );

        }


        /*
         * Always show sidebar at very top
         */

        if (currentScroll <= 60) {

            clearTimeout(sidebarTimer);

            showDashboardSidebar();

        }


        lastScrollPosition =
            currentScroll;

    },
    {
        passive: true
    }
);


/* ============================================================
   END — AUTO SIDEBAR
   ============================================================ */
   /* ============================================================
   FINEXA — DEMO DASHBOARD JAVASCRIPT
   PART 1 + PART 2 + PART 3
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       ELEMENTS
       ======================================================== */

    const sidebar =
        document.querySelector(".dashboard-sidebar");

    const main =
        document.querySelector(".dashboard-main");

    const navLinks =
        document.querySelectorAll(".dashboard-nav-link");

    const sections = [
        document.getElementById("overview"),
        document.getElementById("analytics"),
        document.getElementById("insights"),
        document.getElementById("reports"),
        document.getElementById("financial-health")
    ].filter(Boolean);


    /* ========================================================
       SIDEBAR STATE
       ======================================================== */

    let sidebarTimer = null;
    let lastScrollPosition = window.scrollY;
    let sidebarHidden = false;


    function hideSidebar() {

        if (!sidebar || sidebarHidden) {
            return;
        }

        sidebarHidden = true;

        sidebar.classList.add(
            "sidebar-hidden"
        );

        if (main) {
            main.classList.add(
                "dashboard-expanded"
            );
        }
    }


    function showSidebar() {

        if (!sidebar) {
            return;
        }

        sidebarHidden = false;

        sidebar.classList.remove(
            "sidebar-hidden"
        );

        if (main) {
            main.classList.remove(
                "dashboard-expanded"
            );
        }
    }


    /* ========================================================
       SIDEBAR AUTO HIDE
       ======================================================== */

    window.addEventListener(
        "scroll",
        () => {

            const currentScroll =
                window.scrollY;

            const difference =
                currentScroll -
                lastScrollPosition;

            clearTimeout(
                sidebarTimer
            );


            /* Scroll DOWN */

            if (
                difference > 5 &&
                currentScroll > 100
            ) {

                sidebarTimer =
                    setTimeout(
                        () => {
                            hideSidebar();
                        },
                        1000
                    );
            }


            /* Scroll UP */

            else if (
                difference < -5
            ) {

                sidebarTimer =
                    setTimeout(
                        () => {
                            showSidebar();
                        },
                        1000
                    );
            }


            /* Back to top */

            if (
                currentScroll <= 60
            ) {

                clearTimeout(
                    sidebarTimer
                );

                showSidebar();
            }


            lastScrollPosition =
                currentScroll;

        },
        {
            passive: true
        }
    );


    /* ========================================================
       SIDEBAR NAVIGATION
       ======================================================== */

    navLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        !href.startsWith("#")
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            href
                        );
                        if (!target) {
                        return;
                    }


                    event.preventDefault();


                    /* Show sidebar immediately */

                    showSidebar();


                    /* Smooth scroll */

                    setTimeout(
                        () => {

                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        },
                        50
                    );

                }
            );

        }
    );


    /* ========================================================
       ACTIVE SIDEBAR SECTION
       ======================================================== */

    function updateActiveNavigation() {

        const currentPosition =
            window.scrollY + 180;


        let activeSection =
            sections[0];


        sections.forEach(
            (section) => {

                if (
                    currentPosition >=
                    section.offsetTop
                ) {

                    activeSection =
                        section;
                }

            }
        );


        navLinks.forEach(
            (link) => {

                link.classList.remove(
                    "active"
                );


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    activeSection &&
                    href ===
                    `#${activeSection.id}`
                ) {

                    link.classList.add(
                        "active"
                    );
                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    updateActiveNavigation();


    /* ========================================================
       PERIOD SELECTOR
       ======================================================== */

    const periodButtons =
        document.querySelectorAll(
            ".period-option"
        );


    periodButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    periodButtons.forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const selectedPeriod =
                        button.textContent.trim();


                    document
                        .querySelectorAll(
                            ".selected-period"
                        )
                        .forEach(
                            (element) => {
                                element.textContent =
                                    selectedPeriod;
                            }
                        );

                }
            );

        }
    );


    /* ========================================================
       PART 3 — FINANCIAL HEALTH ANIMATION
       ======================================================== */

    const healthSection =
        document.getElementById(
            "financial-health"
        );


    let healthAnimated = false;


    function animateHealthSection() {

        if (
            !healthSection ||
            healthAnimated
        ) {
            return;
        }


        const rect =
            healthSection.getBoundingClientRect();


        if (
            rect.top <
            window.innerHeight * 0.82
        ) {

            healthAnimated = true;


            /* Progress bars */
            const progressBars =
                healthSection.querySelectorAll(
                    ".factor-progress span"
                );


            progressBars.forEach(
                (bar, index) => {

                    const width =
                        bar.style.width;


                    bar.style.width =
                        "0%";


                    setTimeout(
                        () => {

                            bar.style.width =
                                width;

                        },
                        180 + (index * 120)
                    );

                }
            );


            /* Health ring */

            const ring =
                healthSection.querySelector(
                    ".health-large-ring"
                );


            if (ring) {

                ring.classList.add(
                    "health-ring-active"
                );

            }

        }

    }


    /* ========================================================
       PART 3 — INSIGHTS REVEAL
       ======================================================== */

    const insightsSection =
        document.getElementById(
            "insights"
        );


    let insightsAnimated = false;


    function animateInsights() {

        if (
            !insightsSection ||
            insightsAnimated
        ) {
            return;
        }


        const rect =
            insightsSection.getBoundingClientRect();


        if (
            rect.top <
            window.innerHeight * 0.82
        ) {

            insightsAnimated = true;


            const cards =
                insightsSection.querySelectorAll(
                    ".primary-insight-card, .insight-item"
                );


            cards.forEach(
                (card, index) => {

                    card.style.opacity = "0";
                    card.style.transform =
                        "translateY(18px)";


                    setTimeout(
                        () => {

                            card.style.transition =
                                "opacity 0.55s ease, transform 0.55s ease";

                            card.style.opacity =
                                "1";

                            card.style.transform =
                                "translateY(0)";

                        },
                        index * 120
                    );

                }
            );

        }

    }


    /* ========================================================
       PART 3 — REPORT INTERACTIONS
       ======================================================== */

    const reportButtons =
        document.querySelectorAll(
            ".report-action, .reports-main-button"
        );


    reportButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const originalText =
                        button.textContent.trim();


                    button.disabled = true;

                    button.style.opacity =
                        "0.65";


                    button.textContent =
                        "Preparing...";


                    setTimeout(
                        () => {

                            button.textContent =
                                "Generated ✓";

                            button.style.opacity =
                                "1";


                        },
                        900
                    );


                    setTimeout(
                        () => {

                            button.textContent =
                                originalText;

                            button.disabled =
                                false;

                        },
                        2200
                    );

                }
            );

        }
    );


    /* ========================================================
       SCROLL ANIMATION CHECK
       ======================================================== */
       function handleSectionAnimations() {

        animateHealthSection();

        animateInsights();

    }


    window.addEventListener(
        "scroll",
        handleSectionAnimations,
        {
            passive: true
        }
    );


    handleSectionAnimations();


    /* ========================================================
       KPI CARD HOVER EFFECT
       ======================================================== */

    const kpiCards =
        document.querySelectorAll(
            ".dashboard-kpi-card"
        );


    kpiCards.forEach(
        (card) => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.style.transform =
                        "translateY(-3px)";

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "translateY(0)";

                }
            );

        }
    );


    /* ========================================================
       ANALYTICS CARD HOVER
       ======================================================== */

    const analyticsCards =
        document.querySelectorAll(
            ".chart-panel, .analytics-kpi"
        );


    analyticsCards.forEach(
        (card) => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.classList.add(
                        "card-hover"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.classList.remove(
                        "card-hover"
                    );

                }
            );

        }
    );


    /* ========================================================
       LIVE INDICATORS
       ======================================================== */

    const liveIndicators =
        document.querySelectorAll(
            ".dashboard-live span, .insight-live-badge span"
        );


    liveIndicators.forEach(
        (indicator) => {

            indicator.style.animation =
                "livePulse 1.8s ease-in-out infinite";

        }
    );


    /* ========================================================
       KEYBOARD ACCESS
       ======================================================== */

    navLinks.forEach(
        (link) => {

            link.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        link.click();

                    }

                }
            );

        }
    );


    /* ========================================================
       REDUCED MOTION
       ======================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (
        reducedMotion.matches
    ) {

        document.documentElement
            .style
            .scrollBehavior = "auto";

    }


    /* ========================================================
       INITIAL STATE
       ======================================================== */

    showSidebar();

    console.log(
        "FINEXA Dashboard initialized successfully."
    );

});
/* ============================================================
   FINEXA — FINANCIAL HEALTH INTERACTIONS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const healthSection =
        document.querySelector("#financial-health");

    if (!healthSection) {
        return;
    }


    /* ========================================================
       HEALTH PROGRESS BARS
       ======================================================== */

    const progressBars =
        healthSection.querySelectorAll(
            ".factor-progress span"
        );


    progressBars.forEach((bar) => {

        const targetWidth =
            bar.style.width;

        bar.dataset.width =
            targetWidth;

        bar.style.width = "0%";

    });


    /* ========================================================
       INTERSECTION OBSERVER
       ======================================================== */

    const healthObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    healthSection.classList.add(
                        "health-visible"
                    );


                    /* Animate progress bars */

                    progressBars.forEach(
                        (bar, index) => {

                            setTimeout(
                                () => {

                                    bar.style.width =
                                        bar.dataset.width;

                                },
                                180 + (index * 140)
                            );

                        }
                    );


                    /* Animate health score */

                    animateHealthScore();


                    observer.unobserve(
                        healthSection
                    );

                });

            },
            {
                threshold: 0.22
            }
        );


    healthObserver.observe(
        healthSection
    );


    /* ========================================================
       HEALTH SCORE COUNTER
       ======================================================== */

    function animateHealthScore() {

        const scoreElements =
            healthSection.querySelectorAll(
                ".health-large-ring-inner strong, .health-score-badge strong"
            );


        scoreElements.forEach(
            (element, index) => {

                let current = 0;

                const target = 87;

                const duration = 1100;

                const startTime =
                    performance.now();


                function updateScore(
                    currentTime
                ) {

                    const elapsed =
                        currentTime -
                        startTime;


                    const progress =
                        Math.min(
                            elapsed / duration,
                            1
                        );


                    /* Smooth easing */

                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );


                    current =
                        Math.round(
                            target * eased
                        );


                    element.textContent =
                        current;


                    if (progress < 1) {

                        requestAnimationFrame(
                            updateScore
                        );

                    } else {

                        element.textContent =
                            target;

                    }

                }


                setTimeout(
                    () => {
                        requestAnimationFrame(
                            updateScore
                        );

                    },
                    index * 150
                );

            }
        );

    }


    /* ========================================================
       HEALTH FACTOR CARD INTERACTION
       ======================================================== */

    const factorCards =
        healthSection.querySelectorAll(
            ".health-factor-card"
        );


    factorCards.forEach(
        (card) => {

            card.addEventListener(
                "mouseenter",
                () => {

                    factorCards.forEach(
                        (otherCard) => {

                            if (
                                otherCard !== card
                            ) {

                                otherCard.style.opacity =
                                    "0.65";

                            }

                        }
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    factorCards.forEach(
                        (otherCard) => {

                            otherCard.style.opacity =
                                "1";

                        }
                    );

                }
            );

        }
    );


    /* ========================================================
       SIGNAL CARD INTERACTION
       ======================================================== */

    const signalItems =
        healthSection.querySelectorAll(
            ".health-signal-item"
        );


    signalItems.forEach(
        (item) => {

            item.addEventListener(
                "click",
                () => {

                    signalItems.forEach(
                        (otherItem) => {

                            otherItem.classList.remove(
                                "signal-selected"
                            );

                        }
                    );


                    item.classList.add(
                        "signal-selected"
                    );

                }
            );

        }
    );


    /* ========================================================
       HEALTH RING HOVER
       ======================================================== */

    const healthRing =
        healthSection.querySelector(
            ".health-large-ring"
        );


    if (healthRing) {

        healthRing.addEventListener(
            "mouseenter",
            () => {

                healthRing.style.transform =
                    "rotate(-45deg) scale(1.035)";

            }
        );


        healthRing.addEventListener(
            "mouseleave",
            () => {

                healthRing.style.transform =
                    "rotate(-45deg) scale(1)";

            }
        );

    }

});
