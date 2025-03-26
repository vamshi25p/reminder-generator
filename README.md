# Match Reminder App - README

## Overview

The Match Reminder App is a React-based web application designed to automate the generation of reminder messages for sports matches, based on data extracted from an uploaded Excel file. It reads match schedules, extracts relevant information such as match time, players, venue, and sport, and generates formatted messages suitable for sending to participants.

## Features

*   **Excel File Upload**: Accepts `.xlsx` and `.xls` files containing match schedules.
*   **Data Extraction**: Parses the uploaded Excel file, identifying dates, sports, and match details.
*   **Date and Sport Selection**: Allows users to select a specific date and sport to filter matches.
*   **Message Generation**: Creates personalized reminder messages for each match, including player names, venue, time, and sport.
*   **Copy to Clipboard**: Provides a button to easily copy each generated message to the clipboard for quick sharing.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **XLSX (js-xlsx)**: A library for parsing and manipulating Excel files in JavaScript.
*   **Lucide React**: A library for beautiful, consistent icons.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

## Usage

1.  **Start the development server:**

    ```bash
    npm start  # or yarn start
    ```

    This will typically launch the app in your browser at `http://localhost:3000`.

2.  **Upload your Excel file:** Click the "Upload Excel File" button to select and upload your match schedule file.

3.  **Select a Date:**  Choose the desired date from the "Select Date" dropdown.  This dropdown will populate with the dates parsed from your Excel file.

4.  **Select a Sport:**  Choose the desired sport from the "Select Sport" dropdown.  This dropdown will populate based on the selected date and the sports available on that date from the Excel file. Note that sports are identified by the Excel sheet names (e.g., "carroms", "table.tennis").

5.  **Generate Messages:** Click the "Generate Messages" button to create the reminder messages.

6.  **Copy Messages:** Each generated message will appear in a text area. Click the "Copy to clipboard" button (clipboard icon) next to each message to copy it.

## Excel File Format

The application expects the Excel file to be structured in a specific way to correctly extract the data:

*   **Multiple Sheets**:  The Excel file can contain multiple sheets, with each sheet representing a different sport (e.g., "carroms", "table.tennis"). The sheet name is used as the sport identifier.

*   **Date Headers**: Dates should be in a merged cell format, where the date occupies the first cell of the row, and the remaining cells in that row are empty.  The date should be formatted as a string that includes a hyphen (`-`). Example: `"2024-10-27"`

*   **Match Table Header**: Following the date, there should be a header row containing at least the following column headers: "Level", "Sport", "Category", "Venue", "Match #", "Slot".  The order of these columns is important.

*   **Match Data**: Match data should follow the header row. Each match occupies multiple rows:
    *   **Match Row**: Contains the main match information (Level, Sport, Category, Venue, Match #, Slot). Crucially, the "Match #" column (index 4) must start with "Match" for the application to identify it as a match row.
    *   **Player 1 Row**: The row immediately following the Match Row should contain the Player 1's name in the "Match #" column (index 4).
    *   **"vs" Row (Skipped)**:  The row following the Player 1 Row should typically contain "vs". This row is skipped by the parser.
    *   **Player 2 Row**: The row following the "vs" row should contain Player 2's name in the "Match #" column (index 4).

**Example Data Structure:**

```excel
Sheet Name: carroms

|                          Tue - 25 - Mar - 2025                         |
|------------|-----------|-----------|-----------|-----------|-----------|
| Level      | Sport     | Category  | Venue     | Match #   | Slot      |
| Senior     | Carroms   | Singles   | Main Hall | Match 1   | 9:00 AM   |
|            |           |           |           | John Doe  |           |
|            |           |           |           | vs        |           |
|            |           |           |           | Jane Smith|           |
| Senior     | Carroms   | Doubles   | Main Hall | Match 2   | 10:00 AM  |
|            |           |           |           | Team A    |           |
|            |           |           |           | vs        |           |
|            |           |           |           | Team B    |           |
