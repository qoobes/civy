import 'package:dio/dio.dart';

Dio dio = new Dio();

Stream getStuff() async* {
  dynamic data = await dio.get("https://google.com");
  Future.delayed(Duration(seconds: 5));
  yield data;
  data = await dio.get("https://youtube.com");
  Future.delayed(Duration(seconds: 5));
  yield data;
}

main(List<String> args) {
  print(getStuff());
}
