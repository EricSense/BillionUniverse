import type { Universe, UniverseNode } from "./types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function childrenOf(nodes: UniverseNode[], parentId: string): UniverseNode[] {
  return nodes.filter((n) => n.parentId === parentId);
}

function renderNode(node: UniverseNode, nodes: UniverseNode[]): string {
  const kids = childrenOf(nodes, node.id)
    .map((c) => renderNode(c, nodes))
    .join("\n");
  const value = escapeHtml(node.props.value ?? node.props.label ?? node.name);
  switch (node.kind) {
    case "page":
      return `<main class="page" data-id="${escapeHtml(node.id)}">${kids}</main>`;
    case "section":
      return `<section class="section" data-id="${escapeHtml(node.id)}">${kids}</section>`;
    case "text":
      return `<${node.props.as === "p" ? "p" : "h1"} class="text">${value}</${node.props.as === "p" ? "p" : "h1"}>`;
    case "button":
      return `<a class="btn" href="${escapeHtml(node.props.href ?? "#")}">${value}</a>${kids}`;
    case "input":
      return `<label class="field">${escapeHtml(node.props.label ?? node.name)}<input placeholder="${escapeHtml(node.props.placeholder ?? "")}"/></label>`;
    case "image":
      return `<div class="frame" aria-label="${value}">${value}</div>`;
    case "data":
      return `<aside class="data">data · ${value}</aside>`;
    case "action":
      return `<div class="action">⚡ ${value}</div>`;
    case "hardware":
      return `<div class="hw"><strong>${escapeHtml(node.props.device ?? node.name)}</strong><span>${escapeHtml(node.props.operation ?? "execute")} · ${escapeHtml(node.props.object ?? node.props.material ?? "job")}</span></div>`;
    default:
      return kids;
  }
}

export function compilePreview(universe: Universe): string {
  const pages = universe.nodes.filter((n) => n.kind === "page");
  const looseHardware = universe.nodes.filter((n) => n.kind === "hardware" && !n.parentId);
  const roots = pages.length
    ? [...pages, ...looseHardware]
    : universe.nodes.filter((n) => !n.parentId);
  const body = roots.map((n) => renderNode(n, universe.nodes)).join("\n");
  const hardware = universe.nodes.filter((n) => n.kind === "hardware");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(universe.name)} — preview</title>
  <style>
    :root { color-scheme: dark; }
    body { margin:0; font-family: ui-sans-serif, system-ui, sans-serif; background:#07070c; color:#f4f1ea; }
    .page { max-width: 720px; margin: 0 auto; padding: 48px 24px 80px; }
    .section { margin: 28px 0; padding: 24px; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; background: rgba(255,255,255,.03); }
    h1 { font-family: Georgia, serif; font-weight: 400; font-size: clamp(32px, 6vw, 56px); letter-spacing: -0.03em; margin: 0 0 12px; }
    p { color: rgba(244,241,234,.72); line-height: 1.6; margin: 0 0 16px; }
    .btn { display:inline-flex; margin-top: 8px; padding: 10px 16px; border-radius: 999px; background:#d6ff4b; color:#111; font-weight: 600; text-decoration:none; }
    .field { display:flex; flex-direction:column; gap:6px; font-size:13px; color:rgba(244,241,234,.7); margin: 10px 0; }
    .field input { background:#0c0c12; border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:10px 12px; color:#fff; }
    .frame { height:160px; border-radius:16px; background: radial-gradient(circle at 30% 20%, #8b7cff55, transparent 40%), radial-gradient(circle at 80% 80%, #d6ff4b33, #12121a); display:flex; align-items:end; padding:14px; font-size:12px; color:rgba(244,241,234,.7); }
    .data, .action { font-size:12px; opacity:.7; margin-top:8px; }
    .hw { margin-top: 16px; padding: 14px 16px; border-radius: 14px; border:1px dashed #c9a8ff; display:flex; flex-direction:column; gap:4px; }
    .hw span { font-size:12px; color:rgba(244,241,234,.65); }
    footer { max-width:720px; margin:0 auto; padding: 0 24px 40px; font-size:11px; color:rgba(244,241,234,.45); }
  </style>
</head>
<body>
${body}
<footer>Compiled from the Billion Universe graph · ${hardware.length} hardware node${hardware.length === 1 ? "" : "s"} · directed ≠ executed</footer>
</body>
</html>`;
}

export function previewBytes(html: string): number {
  return new TextEncoder().encode(html).length;
}
