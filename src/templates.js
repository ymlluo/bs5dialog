/**
 *create spinner
 * @param {*} animationName
 * @returns
 */

export function getSpinnerHtml(animationName) {
  const spinnerTypes = {
    plane: `<div class="sk-plane text-white"></div>`,
    chase: `<div class="sk-chase">
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
  </div>`,
    bounce: `<div class="sk-bounce">
    <div class="sk-bounce-dot"></div>
    <div class="sk-bounce-dot"></div>
  </div>`,
    wave: `<div class="sk-wave">
    <div class="sk-wave-rect"></div>
    <div class="sk-wave-rect"></div>
    <div class="sk-wave-rect"></div>
    <div class="sk-wave-rect"></div>
    <div class="sk-wave-rect"></div>
  </div>`,
    pulse: `<div class="sk-pulse"></div>`,
    flow: `<div class="sk-flow">
    <div class="sk-flow-dot"></div>
    <div class="sk-flow-dot"></div>
    <div class="sk-flow-dot"></div>
  </div>`,
    swing: `<div class="sk-swing">
    <div class="sk-swing-dot"></div>
    <div class="sk-swing-dot"></div>
  </div>`,
    circle: `<div class="sk-circle">
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
    <div class="sk-circle-dot"></div>
  </div>`,
    circle_fade: `<div class="sk-circle-fade">
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
    <div class="sk-circle-fade-dot"></div>
  </div>`,
    grid: `<div class="sk-grid">
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
  </div>`,
    fold: `<div class="sk-fold">
    <div class="sk-fold-cube"></div>
    <div class="sk-fold-cube"></div>
    <div class="sk-fold-cube"></div>
    <div class="sk-fold-cube"></div>
  </div>`,
    wander: `<div class="sk-wander">
    <div class="sk-wander-cube"></div>
    <div class="sk-wander-cube"></div>
    <div class="sk-wander-cube"></div>
  </div>`
    // 添加其他类型的 spinner
    // ...
  };
  
  return spinnerTypes[animationName] || '<div class="spinner-border" role="status"></div>';
}

export function getIconHtml(iconName, className, size = "2rem") {
  switch (iconName) {
    case "success":
    case "ok":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-circle-check" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M9 12l2 2l4 -4"></path>
     </svg>
     </svg>`;
      break;
    case "fail":
    case "error":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-circle-x" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
          <path d="M10 10l4 4m0 -4l-4 4"></path>
       </svg>`;
    case "info":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-info-circle" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
        <path d="M12 9h.01"></path>
        <path d="M11 12h1v4h1"></path>
     </svg>`;
      break;
    case "alert":
    case "warn":
      case 'warning':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-alert-triangle" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.24 3.957l-8.422 14.06a1.989 1.989 0 0 0 1.7 2.983h16.845a1.989 1.989 0 0 0 1.7 -2.983l-8.423 -14.06a1.989 1.989 0 0 0 -3.4 0z"></path>
        <path d="M12 9v4"></path>
        <path d="M12 17h.01"></path>
     </svg>`;
      break;
    case "help":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-help" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
          <path d="M12 17l0 .01"></path>
          <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4"></path>
       </svg>`;
    case "edit":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-edit" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
        <path d="M16 5l3 3"></path>
     </svg>`;
    case "code":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}  icon-tabler-code" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.75" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 8l-4 4l4 4"></path>
      <path d="M17 8l4 4l-4 4"></path>
      <path d="M14 4l-4 16"></path>
   </svg>`;
      break;
    case "drag":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className} icon-tabler-drag-drop" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
          <path d="M13 13l9 3l-4 2l-2 4l-3 -9"></path>
          <path d="M3 3l0 .01"></path>
          <path d="M7 3l0 .01"></path>
          <path d="M11 3l0 .01"></path>
          <path d="M15 3l0 .01"></path>
          <path d="M3 7l0 .01"></path>
          <path d="M3 11l0 .01"></path>
          <path d="M3 15l0 .01"></path>
       </svg>`;
      break;
    case "pinned":
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${className} icon-tabler-pinned" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6"></path>
            <path d="M12 16l0 5"></path>
            <path d="M8 4l8 0"></path>
         </svg>`;
         case 'dot':
          return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" width="${size}" height="${size}" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
        </svg>`
          break;
          case 'fullscreen':
            return `<svg xmlns="http://www.w3.org/2000/svg" role="button"  class="${className}" width="${size}" height="${size}" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
          </svg>`
          case 'fullscreen-exit':
            return `<svg xmlns="http://www.w3.org/2000/svg" role="button" class="${className}" width="${size}" height="${size}" fill="currentColor" class="bi bi-fullscreen-exit" viewBox="0 0 16 16">
            <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
          </svg>`
    default:
      return iconName;
  }
}
