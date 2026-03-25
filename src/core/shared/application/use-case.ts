export interface Input<Input_ extends object = object, Output = unknown> {
  exec: (input: Input_) => Promise<Output>
}
