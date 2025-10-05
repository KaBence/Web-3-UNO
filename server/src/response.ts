export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T
  ) {}

  static ok<T>(data: T, message = "Success") {
    return new ApiResponse<T>(true, message, data)
  }

  static fail(message: string) {
    return new ApiResponse<null>(false, message, null)
  }
}