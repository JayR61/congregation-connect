
import * as React from "react";

export interface CheckProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const Check = React.forwardRef<SVGSVGElement, CheckProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
);

Check.displayName = "Check";

export { Check };
