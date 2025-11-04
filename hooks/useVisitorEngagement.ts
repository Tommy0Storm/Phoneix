import { useState, useEffect, useRef } from 'react';

interface VisitorEngagementState {
  shouldAutoOpen: boolean;
  showNotification: boolean;
  showWelcomeTooltip: boolean;
  isFirstVisit: boolean;
}

export const useVisitorEngagement = () => {
  const [state, setState] = useState<VisitorEngagementState>({
    shouldAutoOpen: false,
    showNotification: true,
    showWelcomeTooltip: false,
    isFirstVisit: false,
  });

  const reEngagementIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('phoenix_visited');
    const lastInteraction = localStorage.getItem('phoenix_last_interaction');
    const now = Date.now();

    if (!hasVisited) {
      // First-time visitor - be more aggressive
      setState(prev => ({ ...prev, isFirstVisit: true }));
      localStorage.setItem('phoenix_visited', 'true');

      // Show welcome tooltip after 2 seconds
      const tooltipTimer = setTimeout(() => {
        setState(prev => ({ ...prev, showWelcomeTooltip: true }));
      }, 2000);

      // Auto-open chat after 5 seconds if no interaction
      const autoOpenTimer = setTimeout(() => {
        const hasInteracted = localStorage.getItem('phoenix_last_interaction');
        if (!hasInteracted) {
          setState(prev => ({ ...prev, shouldAutoOpen: true }));
        }
      }, 5000);

      // Hide welcome tooltip after 15 seconds
      const hideTooltipTimer = setTimeout(() => {
        setState(prev => ({ ...prev, showWelcomeTooltip: false }));
      }, 15000);

      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(autoOpenTimer);
        clearTimeout(hideTooltipTimer);
      };
    } else if (lastInteraction) {
      // Returning visitor - check time since last interaction
      const timeSinceLastInteraction = now - parseInt(lastInteraction);
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (timeSinceLastInteraction > oneDayInMs) {
        // Been a while - show welcome tooltip after 3 seconds
        const tooltipTimer = setTimeout(() => {
          setState(prev => ({ ...prev, showWelcomeTooltip: true }));
        }, 3000);

        const hideTooltipTimer = setTimeout(() => {
          setState(prev => ({ ...prev, showWelcomeTooltip: false }));
        }, 12000);

        return () => {
          clearTimeout(tooltipTimer);
          clearTimeout(hideTooltipTimer);
        };
      }
    }
  }, []);

  const markInteraction = () => {
    localStorage.setItem('phoenix_last_interaction', Date.now().toString());
    setState(prev => ({
      ...prev,
      showNotification: false,
      showWelcomeTooltip: false,
    }));
  };

  const dismissNotification = () => {
    setState(prev => ({ ...prev, showNotification: false }));
  };

  const dismissTooltip = () => {
    setState(prev => ({ ...prev, showWelcomeTooltip: false }));
  };

  const startReEngagement = () => {
    // Clear any existing interval
    if (reEngagementIntervalRef.current) {
      clearInterval(reEngagementIntervalRef.current);
    }

    // Start re-engagement every 10 seconds
    reEngagementIntervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        showNotification: true,
        showWelcomeTooltip: true,
      }));

      // Auto-hide tooltip after 5 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, showWelcomeTooltip: false }));
      }, 5000);
    }, 10000);
  };

  const stopReEngagement = () => {
    if (reEngagementIntervalRef.current) {
      clearInterval(reEngagementIntervalRef.current);
      reEngagementIntervalRef.current = null;
    }
  };

  const onChatClosed = () => {
    // User closed the chat - start persistent re-engagement
    setState(prev => ({
      ...prev,
      showNotification: true,
      showWelcomeTooltip: true,
    }));

    // Start the 10-second interval
    startReEngagement();
  };

  const onChatOpened = () => {
    // User opened chat - stop re-engagement
    stopReEngagement();
    markInteraction();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopReEngagement();
    };
  }, []);

  return {
    ...state,
    markInteraction,
    dismissNotification,
    dismissTooltip,
    onChatClosed,
    onChatOpened,
  };
};
