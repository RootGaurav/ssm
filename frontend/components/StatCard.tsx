"use client";

import React from "react";
import Link from "next/link";

type StatCardProps = {
  title: string;
  value?: string | number;
  subtitle?: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, { ring: string; icon: string }> = {
  default: {
    ring: "border-gray-200",
    icon: "bg-gray-100 text-gray-700",
  },
  success: {
    ring: "border-green-200",
    icon: "bg-green-100 text-green-700",
  },
  warning: {
    ring: "border-amber-200",
    icon: "bg-amber-100 text-amber-700",
  },
  danger: {
    ring: "border-red-200",
    icon: "bg-red-100 text-red-700",
  },
  info: {
    ring: "border-blue-200",
    icon: "bg-blue-100 text-blue-700",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  description,
  badge,
  icon,
  tone = "default",
  actionLabel,
  actionHref,
  children,
}: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <div className={`bg-white rounded-2xl p-6 border ${styles.ring} shadow-md hover:shadow-lg transition duration-200 min-h-[220px]`}>
      <div className="flex items-start  justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-sm  px-2 font-semibold text-gray-500 tracking-wide">{title}</h3>
          {value !== undefined && value !== null && value !== "" && (
            <p className="text-4xl px-2 font-bold text-gray-900 mt-1 leading-tight">{value}</p>
          )}
          {subtitle && <p className="text-base px-2 font-medium text-gray-700 mt-2 leading-snug">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`shrink-0 p-3  rounded-xl ${styles.icon}`}>
            {icon}
          </div>
        )}
      </div>

      {(badge || description || (actionLabel && actionHref)) && (
        <div className="border-t border-gray-100 pt-4">
          {/* {badge ? (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-light text-gray-700">
              {badge}
            </span>
          ) : (
            <span />
          )} */}

          {badge && (
    <span className="inline-flex  items-center rounded-full bg-gray-100 px-2 py-1 text-sm font-light text-gray-700">
      {badge}
    </span>
  )}
          <div className="mt-3 flex items-center justify-between gap-3">
            {description && (
              <p className="text-sm  px-2 font-medium text-gray-600">{description}</p>
            )}
            {actionLabel && actionHref && (
              <Link
                href={actionHref}
                className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition duration-200 whitespace-nowrap"
              >
                {actionLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      {children && (
        <div className="h-80 bg-gray-50 rounded-xl p-4 mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
