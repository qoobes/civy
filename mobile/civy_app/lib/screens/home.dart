import 'package:liquid_swipe/liquid_swipe.dart';
import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  Home({Key key}) : super(key: key);

  final pages = [
    Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.purple[100]),
    Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.red[100]),
    Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.blue[100])
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(children: [
          LiquidSwipe(
            pages: this.pages,
            onPageChangeCallback: (int index) {},
          ),
          Container(
            alignment: AlignmentDirectional.topCenter,
            child: Text(
              "Civy",
              style: TextStyle(fontSize: 30),
            ),
            height: 40,
            width: double.infinity,
            color: Colors.transparent,
          ),
        ]),
      ),
    );
  }

  appBar(int index) {}
}
