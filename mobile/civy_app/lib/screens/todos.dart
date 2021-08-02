import 'package:civy_app/bloc/todo_bloc.dart';
import 'package:civy_app/bloc/todo_provider.dart';
import 'package:civy_app/bloc/scroll_bloc.dart';
import 'package:civy_app/widgets/backdrop.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class SchedulePage extends StatefulWidget {
  SchedulePage({@required this.title});

  final String title;

  @override
  _SchedulePageState createState() => _SchedulePageState();
}

class _SchedulePageState extends State<SchedulePage> {
  final GlobalKey<BackDropState> _backdropKey = GlobalKey<BackDropState>();

  TodoBloc scheduleBloc;
  ScrollBloc scrollBloc;

  @override
  void initState() {
    super.initState();
    scheduleBloc = TodoBloc();
    scrollBloc = ScrollBloc();
  }

  Stream<List<Object>> count() async* {
    yield ["Hello"];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: TodoProvider(
        scheduleBloc: scheduleBloc,
        child: ScrollProvider(
          scrollBloc: scrollBloc,
          child: StreamBuilder(
            stream: count(),
            builder: (context, snapshot) {
              if (!snapshot.hasData)
                return Center(child: CircularProgressIndicator());
              return BackDrop(
                key: _backdropKey,
                scrollBloc: scrollBloc,
                backLayer: MyBackLayer(
                  key: UniqueKey(),
                  title: widget.title,
                  events: snapshot.data,
                ),
                backTitle: Text(
                  '${widget.title}',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 20.0,
                  ),
                ),
                frontLayer: MyFrontLayer(),
                frontLayerScrollBuilder: (physics) {
                  return MyFrontLayer(
                    scrollPhysics: physics,
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }
}

class MyFrontLayer extends StatefulWidget {
  MyFrontLayer({this.scrollPhysics});

  final ScrollPhysics scrollPhysics;

  @override
  State<StatefulWidget> createState() {
    return MyFrontLayerState();
  }
}

class MyFrontLayerState extends State<MyFrontLayer> {
  @override
  Widget build(BuildContext context) {
    return PhysicalShape(
        child: ClipRRect(
          borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20.0), topRight: Radius.circular(20.0)),
          child: Container(
            color: Colors.white,
          ),
        ),
        elevation: 12.0,
        clipper: ShapeBorderClipper(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20.0),
              topRight: Radius.circular(20.0),
            ),
          ),
        ),
        color: Colors.white);
  }
}

typedef void ScheduleTapDelegate(List<DocumentSnapshot> day);

class MyBackLayer extends StatefulWidget {
  MyBackLayer({Key key, @required this.title, this.events}) : super(key: key);

  final String title;
  final List<dynamic> events;

  @override
  MyBackLayerState createState() => MyBackLayerState();
}

class BackLayerState extends State<MyBackLayer>
    with SingleTickerProviderStateMixin {
  AnimationController _controller;

  PageController _pageController;

  @override
  Widget build(BuildContext context) {
    throw UnimplementedError();
  }

  @override
  void didUpdateWidget(MyBackLayer oldWidget) {
    super.didUpdateWidget(oldWidget);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    ScrollProvider.of(context).horizontalScrollInput.add(_controller.value);
  }

  @override
  void dispose() {
    _pageController.removeListener(_handlePageScroll);
    _controller.dispose();

    super.dispose();
  }

  void _handlePageScroll() {
    _controller.value = (_pageController.position.pixels /
            _pageController.position.maxScrollExtent)
        .clamp(0.0, 1.0)
        .abs();
  }
}

class MyBackLayerState extends State<MyBackLayer>
    with SingleTickerProviderStateMixin {
  AnimationController _controller;
  PageController _pageController;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didUpdateWidget(MyBackLayer oldWidget) {
    super.didUpdateWidget(oldWidget);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    ScrollProvider.of(context).horizontalScrollInput.add(_controller.value);
  }

  @override
  void dispose() {
    _pageController.removeListener(_handlePageScroll);
    _controller.dispose();
    super.dispose();
  }

  void _handlePageScroll() {
    _controller.value = (_pageController.position.pixels /
            _pageController.position.maxScrollExtent)
        .clamp(0.0, 1.0)
        .abs();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 16.0),
      child: Stack(
        alignment: Alignment.center,
        fit: StackFit.expand,
        children: <Widget>[],
      ),
    );
  }
}
