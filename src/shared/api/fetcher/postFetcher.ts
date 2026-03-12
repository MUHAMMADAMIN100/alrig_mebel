import { axiosInstance } from '../axiosInstance'

// type DataType = {
//   name: string
//   phone: string
//   rooms: string
// }
export async function postFetcher(url: string, data: any) {
  try {
    // const formData = new FormData(
    // for (const key in data) {
    //   if (data[key] !== null && data[key] !== undefined) {
    //     if (Array.isArray(data[key])) {
    //       data[key].forEach((value: string) =>
    //         formData.append(`${key}[]`, value)
    //       )
    //     } else {
    //       formData.append(key, data[key])
    //     }
    //   }
    // }
    const response = await axiosInstance.post(url, data)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
