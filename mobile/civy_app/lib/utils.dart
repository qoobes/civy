import 'package:civy_app/widgets/todo.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

extension HexColor on Color {
  /// String is in the format "aabbcc" or "ffaabbcc" with an optional leading "#".
  static Color fromHex(String hexString) {
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  }

  /// Prefixes a hash sign if [leadingHashSign] is set to `true` (default is `true`).
  String toHex({bool leadingHashSign = true}) => '${leadingHashSign ? '#' : ''}'
      '${alpha.toRadixString(16).padLeft(2, '0')}'
      '${red.toRadixString(16).padLeft(2, '0')}'
      '${green.toRadixString(16).padLeft(2, '0')}'
      '${blue.toRadixString(16).padLeft(2, '0')}';
}

Future<List<Todo>> getTodos(String company) async {
  final _collectionRef = FirebaseFirestore.instance
      .collection('companies')
      .doc(company)
      .collection("tasks");
  QuerySnapshot querySnapshot = await _collectionRef.get();

  // Get data from docs and convert map to List
  List<Map> allData = querySnapshot.docs.map((doc) => doc.data()).toList();
  List<Todo> todos;
  for (Map item in allData) {
    todos.add(new Todo(title: item["name"], details: item["tags"]));
  }
}
