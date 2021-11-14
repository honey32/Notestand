import * as React from "react";

export const Arrow: React.FC = () => {
  return (
    <svg className="icon arrow" viewBox="0 0 100 100">
      <path d="M50 20 L20 50 L50 80" />
      <path d="M20 50 L80 50" />
    </svg>
  );
};

export const Hanburger: React.FC = () => {
  return (
    <svg className="icon hamburger" viewBox="0 0 100 100">
      <path d="M18 22 L82 22" />
      <path d="M18 50 L82 50" />
      <path d="M18 78 L82 78" />
    </svg>
  );
};

export const Cross: React.FC = () => {
  return (
    <svg className="icon cross" viewBox="0 0 100 100">
      <path d="M20 20 80 80" />
      <path d="M20 80 80 20" />
    </svg>
  );
};

export const Tabs: React.FC = () => {
  return (
    <svg className="icon tabs" viewBox="0 0 100 100">
      <path
        d="M25 81.25L25 90.63L87.5 90.63L87.5 21.88L25 21.88L25 81.25L12.5 81.25L12.5 9.38L76.09 9.38L76.09 21.78"
        id="e2uOPDlCAc"
      ></path>
    </svg>
  );
};
