<template>
  <svg
    width="135"
    height="130"
    viewBox="0 0 135 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_204_2)">
      <path
        class="star-outline"
        d="M73.9453 5.56213L86.9252 32.7644C88.2372 35.514 90.8512 37.4132 93.8716 37.8114L123.753 41.7504C129.59 42.5199 131.928 49.7135 127.658 53.7671L105.798 74.5186C103.588 76.6161 102.59 79.6889 103.145 82.6845L108.633 112.322C109.705 118.111 103.585 122.557 98.4103 119.749L71.9209 105.371C69.2432 103.918 66.0121 103.918 63.3344 105.371L36.845 119.749C31.6702 122.557 25.5508 118.111 26.6228 112.322L32.1106 82.6845C32.6653 79.6889 31.6669 76.6161 29.4574 74.5186L7.59768 53.7671C3.32756 49.7135 5.66495 42.5199 11.5022 41.7504L41.3837 37.8114C44.4042 37.4132 47.0182 35.514 48.3302 32.7644L61.31 5.56211C63.8456 0.248163 71.4097 0.24817 73.9453 5.56213Z"
        stroke="black"
        stroke-width="5"
        shape-rendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_204_2"
        x="0.407837"
        y="0.57666"
        width="134.44"
        height="129.039"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_204_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_204_2"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<style scoped lang="scss">
svg {
  .star-outline {
    stroke: var(--color-text);
  }
}
</style>
