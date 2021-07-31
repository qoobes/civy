import 'package:civy_app/screens/home_screen.dart';
import 'package:civy_app/screens/todos.dart';
import 'package:civy_app/utils.dart';
import 'package:civy_app/widgets/backdrop.dart';
import 'package:flutter/material.dart';
import 'package:dot_navigation_bar/dot_navigation_bar.dart';
import 'package:liquid_swipe/liquid_swipe.dart';
import 'package:shadow/shadow.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:flutter_sparkline/flutter_sparkline.dart';

class Home extends StatefulWidget {
  final tabs = [
    MainPage(),
    SchedulePage(title: "todos"),
    SchedulePage(title: "todos")
  ];

  Home({Key key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(alignment: AlignmentDirectional.bottomStart, children: [
      widget.tabs[_currentIndex],
      Stack(
        children: [
          DotNavigationBar(
            backgroundColor: HexColor.fromHex("#069191"),
            selectedItemColor: Colors.white,
            currentIndex: _currentIndex,
            items: [
              DotNavigationBarItem(icon: Icon(Icons.home)),
              DotNavigationBarItem(icon: Icon(Icons.person)),
              DotNavigationBarItem(icon: Icon(Icons.settings))
            ],
            onTap: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
          )
        ],
      )
    ]));
  }
}
