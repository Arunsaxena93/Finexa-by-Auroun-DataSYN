/* =========================================================
   FINEXA CONTACT PAGE — PART 1
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const navbar =
        document.querySelector(
            ".contact-navbar"
        );

    const menuButton =
        document.querySelector(
            ".contact-menu-button"
        );

    const mobileMenu =
        document.querySelector(
            ".contact-mobile-menu"
        );

    const heroVisual =
        document.querySelector(
            ".contact-hero-visual"
        );

    const floatingCards =
        document.querySelectorAll(
            ".contact-floating-card"
        );

    const infoCards =
        document.querySelectorAll(
            ".contact-info-card"
        );

    const form =
        document.querySelector(
            ".contact-form"
        );

    const submitButton =
        document.querySelector(
            ".contact-submit-button"
        );


    /* =====================================================
       MOTION SETTINGS
    ====================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const mobileDevice =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;


    /* =====================================================
       NAVBAR SCROLL
    ====================================================== */

    const updateNavbar =
        () => {

            if (!navbar) {
                return;
            }

            if (
                window.scrollY > 30
            ) {

                navbar.classList.add(
                    "navbar-scrolled"
                );

            } else {

                navbar.classList.remove(
                    "navbar-scrolled"
                );

            }
        };


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    if (
        menuButton &&
        mobileMenu
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                menuButton.classList.toggle(
                    "active"
                );

                mobileMenu.classList.toggle(
                    "open"
                );

            }
        );


        const mobileLinks =
            mobileMenu.querySelectorAll(
                "a"
            );


        mobileLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        menuButton.classList.remove(
                            "active"
                        );

                        mobileMenu.classList.remove(
                            "open"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       HERO 3D MOVEMENT
    ====================================================== */

    if (
        heroVisual &&
        !reducedMotion &&
        !mobileDevice
    ) {

        heroVisual.addEventListener(
            "mousemove",
            event => {

                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width -
                    0.5;
                    const y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height -
                    0.5;


                heroVisual.style.transform =
                    `perspective(1000px)
                     rotateX(${y * -6}deg)
                     rotateY(${x * 8}deg)`;
            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                heroVisual.style.transform =
                    "";

            }
        );

    }


    /* =====================================================
       FLOATING CARD INTERACTION
    ====================================================== */

    if (
        !reducedMotion &&
        !mobileDevice
    ) {

        floatingCards.forEach(
            card => {

                card.addEventListener(
                    "mouseenter",
                    () => {

                        card.style.zIndex =
                            "20";

                        card.style.transform =
                            "translateY(-12px) scale(1.04)";

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.zIndex =
                            "";

                        card.style.transform =
                            "";

                    }
                );

            }
        );

    }


    /* =====================================================
       INFORMATION CARD TILT
    ====================================================== */

    if (
        !reducedMotion &&
        !mobileDevice
    ) {

        infoCards.forEach(
            card => {

                card.addEventListener(
                    "mousemove",
                    event => {

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
                            (
                                centerY - y
                            ) /
                            25;

                        const rotateY =
                            (
                                x - centerX
                            ) /
                            25;


                        card.style.transform =
                            `perspective(800px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)
                             translateY(-8px)`;
                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            }
        );

    }


    /* =====================================================
       FORM FOCUS EFFECT
    ====================================================== */

    if (form) {

        const fields =
            form.querySelectorAll(
                "input, textarea"
            );


        fields.forEach(
            field => {

                field.addEventListener(
                    "focus",
                    () => {

                        field.parentElement.classList.add(
                            "field-focused"
                        );

                    }
                );


                field.addEventListener(
                    "blur",
                    () => {
                    field.parentElement.classList.remove(
                            "field-focused"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       SUBMIT BUTTON MICRO INTERACTION
    ====================================================== */

    if (
        submitButton &&
        !reducedMotion
    ) {

        submitButton.addEventListener(
            "mouseenter",
            () => {

                submitButton.style.transform =
                    "translateY(-3px)";

            }
        );


        submitButton.addEventListener(
            "mouseleave",
            () => {

                submitButton.style.transform =
                    "";

            }
        );

    }


    /* =====================================================
       FORM SUBMIT FEEDBACK
    ====================================================== */

    if (
        form &&
        submitButton
    ) {

        form.addEventListener(
            "submit",
            () => {

                submitButton.classList.add(
                    "is-sending"
                );

                const text =
                    submitButton.querySelector(
                        "span"
                    );

                if (text) {

                    text.textContent =
                        "Sending...";

                }

            }
        );

    }


    /* =====================================================
       ESCAPE RESET
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (menuButton) {

                menuButton.classList.remove(
                    "active"
                );

            }


            if (mobileMenu) {

                mobileMenu.classList.remove(
                    "open"
                );

            }


            if (heroVisual) {

                heroVisual.style.transform =
                    "";

            }


            floatingCards.forEach(
                card => {

                    card.style.transform =
                        "";

                }
            );


            infoCards.forEach(
                card => {

                    card.style.transform =
                        "";

                }
            );

        }
    );


    /* =====================================================
       PAGE VISIBILITY
    ====================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                document
                    .querySelectorAll(
                        ".contact-orbit, .contact-floating-card, .contact-orb"
                    )
                    .forEach(
                        element => {

                            element.style.animationPlayState =
                                "paused";

                        }
                    );

            } else {

                document
                    .querySelectorAll(
                        ".contact-orbit, .contact-floating-card, .contact-orb"
                    )
                    .forEach(
                        element => {

                            element.style.animationPlayState =
                                "";

                        }
                    );

            }

        }
    );


    /* =====================================================
       LOGO LOAD SAFETY
    ====================================================== */

    const logo =
        document.querySelector(
            ".contact-logo"
        );

    if (logo) {

        logo.addEventListener(
            "error",
            () => {
            console.warn(
                    "FINEXA Contact: logo could not be loaded."
                );

            }
        );

    }


    /* =====================================================
       INITIAL STATUS
    ====================================================== */

    console.log(
        "FINEXA Contact — Part 1 initialized."
    );

});
/* =========================================================
   CONTACT PART 2 — FINAL BRANDING JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================================
       ELEMENTS
    ========================================================== */

    const brandingSection =
        document.querySelector(
            ".contact-final-branding"
        );

    const logoWrap =
        document.querySelector(
            ".contact-final-logo-wrap"
        );

    const logo =
        document.querySelector(
            ".contact-final-logo"
        );

    const brandContent =
        document.querySelector(
            ".contact-final-brand"
        );

    const founder =
        document.querySelector(
            ".contact-founder"
        );

    const poweredBy =
        document.querySelector(
            ".contact-powered"
        );

    const finalMessage =
        document.querySelector(
            ".contact-final-message"
        );


    /* =========================================================
       MOTION SETTINGS
    ========================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const mobileDevice =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;


    /* =========================================================
       LOGO 3D INTERACTION
    ========================================================== */

    if (
        logoWrap &&
        !reducedMotion &&
        !mobileDevice
    ) {

        logoWrap.addEventListener(
            "mousemove",
            event => {

                const rect =
                    logoWrap.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((centerY - y) / centerY) * 8;

                const rotateY =
                    ((x - centerX) / centerX) * 8;


                logoWrap.style.transform =
                    `perspective(700px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-8px)
                     scale(1.04)`;
            }
        );


        logoWrap.addEventListener(
            "mouseleave",
            () => {

                logoWrap.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       LOGO CLICK EFFECT
    ========================================================== */

    if (
        logoWrap &&
        !reducedMotion
    ) {

        logoWrap.addEventListener(
            "click",
            () => {

                logoWrap.classList.toggle(
                    "logo-active"
                );

                logoWrap.animate(
                    [
                        {
                            transform:
                                "scale(1)"
                        },
                        {
                            transform:
                                "scale(1.08)"
                        },
                        {
                            transform:
                                "scale(1.02)"
                        },
                        {
                            transform:
                                "scale(1)"
                        }
                    ],
                    {
                        duration: 600,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)"
                    }
                );
            }
        );
    }
    /* =========================================================
       BRAND CONTENT PARALLAX
    ========================================================== */

    if (
        brandingSection &&
        brandContent &&
        !reducedMotion &&
        !mobileDevice
    ) {

        brandingSection.addEventListener(
            "mousemove",
            event => {

                const rect =
                    brandingSection.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;


                brandContent.style.transform =
                    translate3d(
                        `${x * 6}px`,
                        `${y * 5}px`,
                        0
                    );
            }
        );


        brandingSection.addEventListener(
            "mouseleave",
            () => {

                brandContent.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================== */

    const revealElements =
        document.querySelectorAll(
            ".contact-final-branding, .contact-final-footer"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "reveal-visible"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                element.classList.add(
                    "reveal-section"
                );

                revealObserver.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "reveal-visible"
                );
            }
        );
    }


    /* =========================================================
       FOUNDER HOVER
    ========================================================== */

    if (
        founder &&
        !reducedMotion
    ) {

        founder.addEventListener(
            "mouseenter",
            () => {

                founder.style.transform =
                    "translateY(-4px)";

                founder.style.transition =
                    "transform 0.4s ease";
            }
        );


        founder.addEventListener(
            "mouseleave",
            () => {

                founder.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       POWERED BY INTERACTION
    ========================================================== */

    if (
        poweredBy &&
        !reducedMotion
    ) {

        poweredBy.addEventListener(
            "mouseenter",
            () => {

                poweredBy.style.transform =
                    "translateY(-3px)";

                poweredBy.style.transition =
                    "transform 0.35s ease";
            }
        );


        poweredBy.addEventListener(
            "mouseleave",
            () => {
                poweredBy.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       FINAL MESSAGE INTERACTION
    ========================================================== */

    if (
        finalMessage &&
        !reducedMotion
    ) {

        finalMessage.addEventListener(
            "mouseenter",
            () => {

                finalMessage.style.transform =
                    "translateY(-3px)";

                finalMessage.style.transition =
                    "transform 0.35s ease";
            }
        );


        finalMessage.addEventListener(
            "mouseleave",
            () => {

                finalMessage.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       LOGO LOAD SAFETY
    ========================================================== */

    if (logo) {

        logo.addEventListener(
            "error",
            () => {

                console.warn(
                    "FINEXA Contact: logo could not be loaded."
                );
            }
        );
    }


    /* =========================================================
       ESCAPE RESET
    ========================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (logoWrap) {
                logoWrap.style.transform = "";
            }

            if (brandContent) {
                brandContent.style.transform = "";
            }

            if (founder) {
                founder.style.transform = "";
            }

            if (poweredBy) {
                poweredBy.style.transform = "";
            }

            if (finalMessage) {
                finalMessage.style.transform = "";
            }
        }
    );


    /* =========================================================
       INITIAL VIEWPORT CHECK
    ========================================================== */

    revealElements.forEach(
        element => {

            const rect =
                element.getBoundingClientRect();

            if (
                rect.top <
                window.innerHeight * 0.9
            ) {

                element.classList.add(
                    "reveal-visible"
                );
            }
        }
    );


    /* =========================================================
       FINAL STATUS
    ========================================================== */

    console.log(
        "FINEXA Contact — Parts 1 & 2 initialized."
    );

});
