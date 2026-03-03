class Automation {
    static async SendMessage (message: string) {
        const res = await fetch("https://shiftly-ai-be.vercel.app/api/automation/chat", {
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