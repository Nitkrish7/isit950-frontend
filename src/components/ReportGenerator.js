import { useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { adminAPI } from "@/lib/api";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#1e40af",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 15,
    color: "#1e40af",
  },
  section: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f3f4f6",
  },
  statLabel: {
    fontSize: 12,
    color: "#4b5563",
  },
  statValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 10,
  },
});

// Superuser Report Component
const SuperuserReport = ({ stats }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Staytion - Superuser Report</Text>
      <Text style={styles.subheader}>System Overview</Text>

      <View style={styles.section}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Users</Text>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Hotels</Text>
          <Text style={styles.statValue}>{stats.totalHotels}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <Text style={styles.statValue}>{stats.totalBookings}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Occupancy Rate</Text>
          <Text style={styles.statValue}>
            {(stats.occupancyRate * 100).toFixed(1)}%
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statValue}>
            ${stats.totalRevenue.toLocaleString()}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Guests Served</Text>
          <Text style={styles.statValue}>{stats.totalGuestsServed}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

// Hotel Admin Report Component
const HotelAdminReport = ({ stats, hotelName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Staytion - Hotel Report</Text>
      <Text style={styles.subheader}>{hotelName}</Text>

      <View style={styles.section}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Rooms</Text>
          <Text style={styles.statValue}>{stats.totalRooms}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Occupied Rooms</Text>
          <Text style={styles.statValue}>{stats.occupiedRooms}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <Text style={styles.statValue}>{stats.totalBookings}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

export default function ReportGenerator({ type, hotelId, hotelName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (type === "superuser") {
        data = await adminAPI.getSuperuserStats();
      } else {
        data = await adminAPI.getHotelAdminStats(hotelId);
      }
      setStats(data);
    } catch (err) {
      setError("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={fetchStats}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {loading ? "Loading..." : "Generate Report"}
      </button>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {stats && (
        <PDFDownloadLink
          document={
            type === "superuser" ? (
              <SuperuserReport stats={stats} />
            ) : (
              <HotelAdminReport stats={stats} hotelName={hotelName} />
            )
          }
          fileName={`${type === "superuser" ? "superuser" : "hotel"}-report-${
            new Date().toISOString().split("T")[0]
          }.pdf`}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      )}
    </div>
  );
}
