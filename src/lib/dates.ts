import * as moment from "moment";

export function formatDateTime(dateTime: string): { date: string, time: string } {
    const startTime = moment.utc(dateTime).local()
    const now = moment.utc(moment.now())

    let date = ""
    if (startTime.isSame(now, "d")) {
        date = "Today"
    } else if (startTime.isSame(now.add(1, "d"), "d")) {
        date = "Tomorrow"
    } else {
        date = startTime.format("dddd D MMMM Y")
    }

    return {
        date,
        time: startTime.format("HH:mm")
    }
}