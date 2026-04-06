import { kpiItems, sections } from "../data/sections.js";
import { renderIdentity, renderIntroStrip } from "./renderContact.js";

function renderKpiBar() {
  return `<div class="kpi-bar">
    ${kpiItems
      .map(
        (item) =>
          `<div class="kpi-item"><div class="kpi-value">${item.value}</div><div class="kpi-label">${item.label}</div></div>`,
      )
      .join("")}
  </div>`;
}

function renderNavItem(section, activeSection) {
  const isActive = section.id === activeSection;

  return `<div class="nav-item ${isActive ? "active" : ""}" data-section="${section.id}">
    <div class="nav-icon" style="background:${section.bg};color:${section.color}">${section.icon}</div>
    <div>
      <div class="nav-label">${section.label}</div>
      <div class="nav-sub">${section.sub}</div>
    </div>
  </div>`;
}

export function renderSidebar(activeSection) {
  return `<div class="panel-left">
    ${renderIdentity()}
    ${renderIntroStrip()}
    ${renderKpiBar()}
    <div class="nav-list">
      ${sections.map((section) => renderNavItem(section, activeSection)).join("")}
    </div>
  </div>`;
}

export function renderContentHeader(activeSection) {
  const section = sections.find(({ id }) => id === activeSection) ?? sections[0];

  return `<div class="content-head">
    <h2>${section.label}</h2>
    <span class="badge" style="background:${section.bg};color:${section.color}">${section.sub}</span>
  </div>`;
}
