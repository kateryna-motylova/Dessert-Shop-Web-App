import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

const faqAccordion = document.querySelector(".faq-accordion");

new Accordion(faqAccordion, {
    elementClass: 'faq-item',
    triggerClass: 'faq-trigger',
    panelClass: 'faq-panel',
    showMultiple: false,
    ariaEnabled: true,
});