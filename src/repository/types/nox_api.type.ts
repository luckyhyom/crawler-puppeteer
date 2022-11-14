// https://www.googleapis.com/youtube/v3/search?part=snippet&key={API_KEY}&type=channel&maxResults=10&q=오킹
export type NoxHistoryJSON = {
    retData: {
        history: [
            {
                value: number, date: { stdaily_view_countring: string }
            }
        ]
    }
}
export type ViewCountHistoryJSON = NoxHistoryJSON['retData']['history'];
export type SubscriberCountHistoryJSON = NoxHistoryJSON['retData']['history'];

//type ViewAndSubHistory<T> = {
//    [key in keyof T]: {
//        daily_view_count: number,
//        subscriber_count: number,
//    }
//}