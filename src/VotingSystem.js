import React, { useState, useEffect } from "react";

const VotingSystem = () => {
    const [userName, setUserName] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteData, setVoteData] = useState([]);
    const [candidates, setCandidates] = useState([
        { id: 1, name: "Candidate A", votes: 0 },
        { id: 2, name: "Candidate B", votes: 0 },
        { id: 3, name: "Candidate C", votes: 0 },
    ]);

    // Load stored vote data from localStorage
    useEffect(() => {
        const storedVotes = localStorage.getItem("votes");
        if (storedVotes) {
            setVoteData(JSON.parse(storedVotes));
        }

        const storedCandidates = localStorage.getItem("candidates");
        if (storedCandidates) {
            setCandidates(JSON.parse(storedCandidates));
        }
    }, []);

    // Save vote data to localStorage
    useEffect(() => {
        localStorage.setItem("votes", JSON.stringify(voteData));
        localStorage.setItem("candidates", JSON.stringify(candidates));
    }, [voteData, candidates]);

    // Check if the user has already voted
    const checkIfVoted = (name) => {
        return voteData.some((vote) => vote.voterName.toLowerCase() === name.toLowerCase());
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();

        if (checkIfVoted(userName)) {
            setHasVoted(true);
        } else {
            setIsSubmitted(true);
        }
    };

    const handleVote = (candidateId) => {
        if (hasVoted) return;

        const selectedCandidateIndex = candidates.findIndex(
            (candidate) => candidate.id === candidateId
        );

        const updatedCandidates = [...candidates];
        updatedCandidates[selectedCandidateIndex].votes++;

        // Update vote data
        setVoteData((prevData) => [
            ...prevData,
            {
                voterName: userName,
                candidate: updatedCandidates[selectedCandidateIndex].name,
            },
        ]);

        setCandidates(updatedCandidates);
        setHasVoted(true);
    };

    const handleLogout = () => {
        // Clear the user name and mark that they have logged out
        setUserName("");
        setIsSubmitted(false);
        setHasVoted(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {!isSubmitted ? (
                    <form onSubmit={handleNameSubmit} style={styles.form}>
                        <h3 style={styles.heading}>Enter your name to proceed:</h3>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>
                            Submit
                        </button>
                    </form>
                ) : (
                    <div>
                        <h2 style={styles.welcomeText}>Welcome, {userName}!</h2>
                        {!hasVoted ? (
                            <>
                                <h3 style={styles.heading}>Cast your vote:</h3>
                                <ul style={styles.voteList}>
                                    {candidates.map((candidate) => (
                                        <li key={candidate.id} style={styles.voteItem}>
                                            <strong>{candidate.name}</strong>
                                            <button
                                                onClick={() => handleVote(candidate.id)}
                                                style={styles.voteButton}
                                            >
                                                Vote
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <h3 style={styles.thankYouText}>Thank you for voting!</h3>
                        )}

                        <div style={styles.results}>
                            <h3 style={styles.heading}>Results:</h3>
                            <ul style={styles.resultsList}>
                                {candidates.map((candidate) => (
                                    <li key={candidate.id} style={styles.resultItem}>
                                        <strong>{candidate.name}</strong>: {candidate.votes} votes
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={styles.voters}>
                            <h3 style={styles.heading}>All Voters:</h3>
                            {voteData.length > 0 ? (
                                <ul style={styles.voterList}>
                                    {voteData.map((vote, index) => (
                                        <li key={index} style={styles.voterItem}>
                                            <span>
                                                <strong>Name:</strong> {vote.voterName}
                                            </span>
                                            <span>
                                                <strong>Vote:</strong> {vote.candidate}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No voters yet.</p>
                            )}
                        </div>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a1b9a, #8e24aa)", // Purple gradient background
        padding: "20px",
    },
    card: {
        background: "rgb(165 225 222)",
        borderRadius: "8px",
        padding: "20px",
        width: "400px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    heading: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#1c1c1c", // Darker color for headings
        marginBottom: "10px",
    },
    input: {
        padding: "10px",
        marginBottom: "10px",
        width: "100%",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    welcomeText: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "rgb(19 125 23)", // Green color for welcome message
    },
    thankYouText: {
        fontSize: "18px",
        color: "#4caf50",
    },
    voteList: {
        listStyle: "none",
        padding: 0,
    },
    voteItem: {
        margin: "10px 0",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "5px",
        textAlign: "center",
    },
    voteButton: {
        marginTop: "10px",
        margin:"8px",  
        padding: "10px 20px",
        backgroundColor:"#3290d7",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    results: {
        marginTop: "20px",
    },
    resultsList: {
        listStyle: "none",
        padding: 0,
    },
    resultItem: {
        margin: "10px 0",
        padding: "10px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    voters: {
        marginTop: "20px",
    },
    voterList: {
        listStyle: "none",
        padding: 0,
    },
    voterItem: {
        margin: "10px 0",
        padding: "10px",
        backgroundColor: "#f1f2f6",
        border: "1px solid #ccc",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoutButton: {
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px",
    },
};

export default VotingSystem;
