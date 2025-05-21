import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { HotelAdminProvider } from "@/context/HotelAdminContext";
import { MembershipProvider } from "@/context/MembershipContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Staytion - Hotel Management",
  description: "Book your stay with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <HotelAdminProvider>
            <MembershipProvider>{children}</MembershipProvider>
          </HotelAdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
