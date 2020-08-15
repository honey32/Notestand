import * as React from "react";

export function LoadingSpinner() {
  return <div className="loading_spinner">
    {[0, 1, 2, 3].map(() => <div className="loading_spinner_dot"></div>)}
  </div>;
}
