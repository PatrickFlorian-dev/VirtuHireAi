import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { User } from "../interfaces/userTypes";

const VerifyUser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // Get userId from URL
  const [user, setUser] = useState<User | null>(null);
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user details when the component mounts
  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const fetchUserDetails = async (id: string) => {
    try {
      const response = await fetch("https://your-api.com/getUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secret) {
      alert("Please enter the secret number.");
      return;
    }

    try {
      const response = await fetch("https://your-api.com/validateSecret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, secret }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Verification successful!");
      } else {
        alert("Invalid secret number. Try again.");
      }
    } catch (error) {
      console.error("Error verifying secret:", error);
    }
  };

  return (
    <div className="p-4">
      <h1>Verify User</h1>

      {loading ? (
        <p>Loading user info...</p>
      ) : user ? (
        <div>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>

          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter Secret Number"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default VerifyUser;
