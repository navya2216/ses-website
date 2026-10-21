import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { companyInfo } from "../companyInfo";
import "../asset/css/company-calendar.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  );
}

function CompanyCalendar() {
  const [calendar, setCalendar] = useState({
    holidays: [],
    serverTime: "",
    timezone: companyInfo.timezone,
    holidayPdf: null,
  });
  const [displayedMonth, setDisplayedMonth] = useState(null);
  const [error, setError] = useState("");
  const timeZone = calendar.timezone || companyInfo.timezone;

  useEffect(() => {
    let mounted = true;

    const loadCalendar = async () => {
      try {
        const response = await api.get("/api/calendar/holidays");
        if (mounted) {
          const nextCalendar = response.data;
          setCalendar(nextCalendar);
          setError("");

          if (nextCalendar.serverTime) {
            const serverParts = getDateParts(
              new Date(nextCalendar.serverTime),
              nextCalendar.timezone || companyInfo.timezone,
            );
            setDisplayedMonth((current) =>
              current || new Date(serverParts.year, serverParts.month - 1, 1),
            );
          }
        }
      } catch {
        if (mounted) setError("The company holiday calendar is unavailable.");
      }
    };

    loadCalendar();
    const timer = window.setInterval(loadCalendar, 60000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const holidayByDate = useMemo(
    () => new Map(calendar.holidays.map((holiday) => [holiday.date, holiday])),
    [calendar.holidays],
  );

  const monthCells = useMemo(() => {
    if (!displayedMonth) return [];

    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = new Date(year, month, 1).getDay();
    const cells = [
      ...Array(offset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [displayedMonth]);

  const serverDate = calendar.serverTime
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone,
      }).format(new Date(calendar.serverTime))
    : "Loading server time…";

  const monthLabel = displayedMonth
    ? new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(
        new Date(
          Date.UTC(displayedMonth.getFullYear(), displayedMonth.getMonth(), 15),
        ),
      )
    : "Loading calendar…";

  const changeMonth = (amount) => {
    setDisplayedMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  };

  return (
    <section className="company-calendar-section section">
      <div className="container">
        <header className="company-calendar-header">
          <h1>Company Holiday Calendar</h1>
          <p>
            All calendar dates are shown. Company holidays are highlighted and
            labeled on their date.
          </p>
          <p>
            Server time: <strong>{serverDate}</strong> ({timeZone})
          </p>
        </header>

        {error && (
          <p role="alert" className="company-calendar-error">
            {error}
          </p>
        )}

        <section className="company-month-calendar" aria-label={monthLabel}>
          <div className="company-calendar-controls">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
              disabled={!displayedMonth}
            >
              ‹
            </button>
            <h2>{monthLabel}</h2>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
              disabled={!displayedMonth}
            >
              ›
            </button>
          </div>

          <div className="company-calendar-grid" role="grid">
            {WEEKDAYS.map((weekday) => (
              <div
                className="company-calendar-weekday"
                role="columnheader"
                key={weekday}
              >
                {weekday}
              </div>
            ))}

            {monthCells.map((day, index) => {
              if (!day) {
                return (
                  <div
                    className="company-calendar-day is-empty"
                    role="gridcell"
                    aria-hidden="true"
                    key={`empty-${index}`}
                  />
                );
              }

              const year = displayedMonth.getFullYear();
              const month = String(displayedMonth.getMonth() + 1).padStart(
                2,
                "0",
              );
              const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
              const holiday = holidayByDate.get(date);

              return (
                <div
                  className={`company-calendar-day${holiday ? " is-holiday" : ""}`}
                  role="gridcell"
                  aria-label={
                    holiday
                      ? `${date}: ${holiday.name}, company holiday`
                      : date
                  }
                  key={date}
                >
                  <span className="company-calendar-day-number">{day}</span>
                  {holiday && (
                    <span className="company-calendar-holiday-name">
                      {holiday.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="company-calendar-legend">
            <span aria-hidden="true" />
            Company holiday
          </p>
        </section>

        {calendar.holidayPdf && (
          <p className="company-calendar-pdf">
            Official schedule:{" "}
            <a
              href={calendar.holidayPdf.url}
              target="_blank"
              rel="noreferrer"
            >
              View or download {calendar.holidayPdf.name || "holiday PDF"}
            </a>
          </p>
        )}

        <section className="company-calendar-list-section">
          <h2>Company holidays</h2>
          {calendar.holidays.length === 0 ? (
            <p className="company-calendar-empty">
              No official company holidays have been published yet.
            </p>
          ) : (
            <ul className="company-holiday-list">
              {calendar.holidays.map((holiday) => (
                <li key={`${holiday.date}-${holiday.name}`}>
                  <time dateTime={holiday.date}>
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "long",
                      timeZone: "UTC",
                    }).format(new Date(`${holiday.date}T00:00:00Z`))}
                  </time>
                  <span>{holiday.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

export default CompanyCalendar;
