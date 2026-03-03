class Automation {
    static async SendMessage (message: string) {
        const res = await fetch("http://localhost:4000/api/automation/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        })
        const data = await res.json()
        return data?.layout
    }
}
export default Automation