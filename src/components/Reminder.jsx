import { useState } from "react";
import * as XLSX from "xlsx";
import { Clipboard, Upload } from "lucide-react";
import "../MatchReminderApp.css";

export default function Reminder() {
  const [messages, setMessages] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSports, setAvailableSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [matchesByDateAndSport, setMatchesByDateAndSport] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      let dates = [];
      let matchesData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        let currentDate = "";
        let processingMatches = false;

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];

          // Check for date row (merged cells appear as first cell with value and others empty)
          if (
            row[0] &&
            typeof row[0] === "string" &&
            row[0].includes("-") &&
            row.slice(1).every((cell) => !cell)
          ) {
            currentDate = row[0].trim();
            if (!dates.includes(currentDate)) {
              dates.push(currentDate);
            }
            matchesData[currentDate] = matchesData[currentDate] || {};
            processingMatches = false;
            continue;
          }

          // Check if this is a header row for matches table
          if (
            currentDate &&
            row.length >= 6 &&
            ["Level", "Sport", "Category", "Venue", "Match #", "Slot"].some(
              (header) => row.includes(header)
            )
          ) {
            processingMatches = true;
            continue;
          }

          // Process match data if we're in a matches section
          if (processingMatches && currentDate && row.length >= 6) {
            const sport = sheetName; // Using sheet name as sport (carroms or table.tennis)
            if (!matchesData[currentDate][sport]) {
              matchesData[currentDate][sport] = [];
            }

            // Check if this row contains match number (the main match row)
            if (
              row[4] &&
              String(row[4]).trim() &&
              String(row[4]).startsWith("Match")
            ) {
              const matchInfo = {
                level: row[0],
                sport: row[1],
                category: row[2],
                venue: row[3],
                matchNum: row[4],
                slot: row[5],
                player1: "",
                player2: "",
              };

              // The next row should be Player 1
              if (i + 1 < jsonData.length) {
                const player1Row = jsonData[i + 1];
                if (player1Row[4]) {
                  matchInfo.player1 = String(player1Row[4]).trim();
                }
              }

              // The row after next should be "vs" (we'll skip this)
              // Then the next row should be Player 2
              if (i + 3 < jsonData.length) {
                const player2Row = jsonData[i + 3];
                if (player2Row[4]) {
                  matchInfo.player2 = String(player2Row[4]).trim();
                }
              }

              matchesData[currentDate][sport].push(matchInfo);
            }
          }
        }
      });

      setAvailableDates(dates);
      setMatchesByDateAndSport(matchesData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    if (matchesByDateAndSport[date]) {
      setAvailableSports(Object.keys(matchesByDateAndSport[date]));
    } else {
      setAvailableSports([]);
    }
    setSelectedSport("");
    setMessages([]);
  };

  const processMatches = () => {
    if (!selectedDate || !selectedSport) return;

    const matches = matchesByDateAndSport[selectedDate][selectedSport] || [];
    const extractedMessages = matches.map((match) => {
      // Format the time if it's an Excel time number
      let matchTime = match.slot;
      if (typeof match.slot === "number") {
        try {
          matchTime = XLSX.SSF.format("h:mm AM/PM", match.slot);
        } catch (e) {
          console.error("Error formatting time:", e);
        }
      }

      // Get players
      const player1 = match.player1 || "Unknown Player 1";
      const player2 = match.player2 || "Unknown Player 2";

      return `📢 On behalf of Celebrelite,  

We are pleased to inform you that your ${match.category} ${match.sport} match (${match.matchNum}) between ${player1} and ${player2} has been scheduled for ${matchTime} tomorrow at ${match.venue}. 🏆  

Kindly proceed with the match at a time that suits your availability and ensure to notify me of the winner upon its completion. We extend our best wishes for a successful and commendable performance.  

Warm regards,  
The Celebrelite Team`;
    });

    setMessages(extractedMessages);
  };

  return (
    <div className="container">
      <h1 className="title">🎾 Serve Up Reminders: Messages Ready to Go 🏅</h1>
      <label className="upload-button">
        <Upload size={24} />
        <span>Upload Excel File</span>
        <input
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {availableDates.length > 0 && (
        <div className="selectors">
          <label>Select Date:</label>
          <select
            value={selectedDate}
            onChange={(e) => handleDateSelection(e.target.value)}
          >
            <option value="">-- Select a Date --</option>
            {availableDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      )}

      {availableSports.length > 0 && (
        <div className="selectors">
          <label>Select Sport:</label>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">-- Select a Sport --</option>
            {availableSports.map((sport, index) => (
              <option key={index} value={sport}>
                {sport === "table.tennis"
                  ? "Table Tennis"
                  : sport.charAt(0).toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDate && selectedSport && (
        <button className="generate-button" onClick={processMatches}>
          Generate Messages
        </button>
      )}

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message-card">
            <textarea className="message-text" readOnly value={msg} />
            <button
              onClick={() => navigator.clipboard.writeText(msg)}
              className="copy-button"
              title="Copy to clipboard"
            >
              <Clipboard size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
