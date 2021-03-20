import { action } from "easy-peasy";

export const state = {
  UI: {
    sideDetails: {
      onFocus: false,
    },
  },

  // Action
  toggleFocusDetails: action((state) => {
    return {
      ...state,
      UI: {
        ...state.UI,
        sideDetails: {
          ...state.UI.sideDetails,
          onFocus: !state.UI.sideDetails.onFocus,
        },
      },
    };
  }),
};
