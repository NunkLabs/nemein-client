import type { NextWebVitalsMetric } from "next/app";

import Game from "./(game)/Game";

export default function HomePage() {
  return (
    <div className="bg-gray-800 h-screen min-w-fit relative">
      <Game />
    </div>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const formattedMetricValue = metric.value.toFixed(2);

  switch (metric.name) {
    /**
     * Refers to the length of time it takes for a page to finish render after
     * a route change
     */
    case "Next.js-render": {
      console.log(`Next.js Render: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to the length of time it takes for a page to start rendering after
     * a route change
     */
    case "Next.js-route-change-to-render": {
      console.log(
        `Next.js Render after Route Change: ${formattedMetricValue}ms.`
      );

      break;
    }

    /**
     * Refers to the length of time it takes for the page to start and finish
     * hydrating
     */
    case "Next.js-hydration": {
      console.log(`Next.js Hydration Duration: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to the time between the browser requesting a page and when it
     * receives the first byte of information from the server
     */
    case "TTFB": {
      console.log(`Time to First Byte: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to when the browser renders the first bit of content from the DOM,
     * providing the first feedback to the user that the page is actually loading
     */
    case "FCP": {
      console.log(`First Contentful Paint: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to the render time of the largest image or text block visible
     * within the viewport, relative to when the page first started loading
     */
    case "LCP": {
      console.log(`Largest Contentful Paint: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to the time from when a user first interacts with a page to the
     * time when the browser is actually able to begin processing event handlers
     * in response to that interaction
     */
    case "FID": {
      console.log(`First Input Delay: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to the largest burst of layout shift scores for every unexpected
     * layout shift that occurs during the entire lifespan of a page
     */
    case "CLS": {
      console.log(`Cummulative Layout Shift: ${formattedMetricValue}ms.`);

      break;
    }

    /**
     * Refers to the responsiveness of all interactions a user has made with
     * the page
     */
    case "INP": {
      console.log(
        `Interaction to Next Paint (experimental): ${formattedMetricValue}ms.`
      );

      break;
    }
  }
}
