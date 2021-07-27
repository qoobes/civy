import 'package:flutter/material.dart';
import 'backdrop.dart';
import 'bloc/schedule_bloc.dart';
import 'bloc/schedule_provider.dart';
import 'bloc/scroll_bloc.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:math' as math;
import 'utils.dart' as utils;

class SchedulePage extends StatefulWidget {
  SchedulePage({@required this.title});

  final String title;

  @override
  _SchedulePageState createState() => _SchedulePageState();
}

class _SchedulePageState extends State<SchedulePage> {
  final GlobalKey<BackDropState> _backdropKey = GlobalKey<BackDropState>();

  ScheduleBloc scheduleBloc;
  ScrollBloc scrollBloc;
  Stream dummyDataStream;

  @override
  void initState() {
    super.initState();

    scheduleBloc = ScheduleBloc();
    scrollBloc = ScrollBloc();
  }

  Stream<List<Object>> count() async* {
    yield ["Hello"];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScheduleProvider(
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
    ScheduleBloc schedule = ScheduleProvider.of(context);

    return PhysicalShape(
        child: ClipRRect(
          borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20.0), topRight: Radius.circular(20.0)),
          child: Container(
            color: Colors.white,
            // child: StreamBuilder(
            //   stream: schedule.latestItem,
            //   builder: (context, snapshot) {
            //     if (snapshot.hasData) {
            //       List<DocumentSnapshot> events =
            //           snapshot.data as List<DocumentSnapshot>;
            //       events.sort((snapshot1, snapshot2) {
            //         if (snapshot1 == null || snapshot2 == null) {
            //           return 0;
            //         }

            //         DateTime firstDate =
            //             (snapshot1['date_start'] as Timestamp).toDate();
            //         DateTime secondDate =
            //             (snapshot2['date_start'] as Timestamp).toDate();

            //         return firstDate.compareTo(secondDate);
            //       });

            //       return Center(
            //         child: EventList(
            //             events: events, scrollPhysics: widget.scrollPhysics),
            //       );
            //     } else {
            //       return Center(child: CircularProgressIndicator());
            //     }
            //   },
            // ),
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
    // TODO: implement build
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

  Map<DateTime, List<Object>> eventsOnDays;
  List<DateTime> days;

  @override
  void initState() {
    super.initState();

    int initialPage = 0;

    if (_pageController != null) {
      _pageController.removeListener(_handlePageScroll);
    }
    _pageController = PageController(
        viewportFraction: 0.8, initialPage: initialPage, keepPage: true)
      ..addListener(_handlePageScroll);
    _controller = AnimationController(
        duration: const Duration(milliseconds: 300), vsync: this, value: 0.0);
    _controller.value = (initialPage / (days.length - 1));
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
        children: <Widget>[
          _buildPageSelector(context, _controller, widget.events)
        ],
      ),
    );
  }

  Widget _buildPageSelector(BuildContext context,
      AnimationController controller, List<DocumentSnapshot> snapshots) {
    if (snapshots.length == 0)
      return Center(
          child: Text('No Internet Connection',
              style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                  fontSize: 16.0)));
    ScheduleProvider.of(context).numItemsInput.add(days.length);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.max,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(left: 48.0, bottom: 16.0),
          child: _CrossFadeTransition(
            alignment: Alignment.centerLeft,
            progress: _controller,
            children: days.map((date) {
              return DayTitle(date: date);
            }).toList(),
          ),
        ),
        SizedBox.fromSize(
            size: Size.fromHeight(MediaQuery.of(context).size.height * 0.575),
            child: PageView()),
      ],
    );
  }
}

class _CrossFadeTransition extends AnimatedWidget {
  const _CrossFadeTransition({
    Key key,
    this.alignment: Alignment.center,
    Animation<double> progress,
    this.child0,
    this.child1,
    this.children,
  }) : super(key: key, listenable: progress);

  final AlignmentGeometry alignment;
  final Widget child0;
  final Widget child1;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final Animation<double> progress = listenable;

    final double progressPerChild = 1.0 / (children.length - 1);

    final List<Widget> opacityChildren = [];

    for (int i = 0; i < children.length; i++) {
      Animation<double> parent;
      Curve curve;

      double progressAtFull = i * progressPerChild;

      double start, end;

      if (progress.value <= progressAtFull) {
        parent = progress;

        start = (i - 1) * progressPerChild;
        end = (i) * progressPerChild;

        start = start.clamp(0.0, 1.0);
        end = end.clamp(0.0, 1.0);

        curve = Interval(start, end);
      } else {
        parent = ReverseAnimation(progress);

        start = (i * progressPerChild);
        end = (i + 1) * progressPerChild;

        start = start.clamp(0.0, 1.0);
        end = end.clamp(0.0, 1.0);

        curve = Interval(start, end).flipped;
      }

      double opacity = CurvedAnimation(parent: parent, curve: curve).value;
      if (progress.value < start || progress.value > end) {
        opacity = 0.0;
      } else if (start == end) {
        opacity = 1.0;
      }

      opacityChildren.add(
        Opacity(
          opacity: opacity,
          child: children[i],
        ),
      );
    }

    return Stack(alignment: alignment, children: opacityChildren);
  }
}

class DayCard extends StatelessWidget {
  DayCard({this.snapshots});

  final List<DocumentSnapshot> snapshots;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4.0,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20.0))),
      margin: EdgeInsets.all(10.0),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          children: snapshots.map((snapshot) {
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: EventRow(
                  (snapshot['date_start'] as Timestamp).toDate(),
                  snapshot['title'],
                  EventType.fromTitle(snapshot['type']),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class EventRow extends StatelessWidget {
  EventRow(this.date, this.title, this.type);

  DateTime date;
  String title;
  EventType type;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.max,
      children: <Widget>[
        IgnorePointer(
          ignoring: true,
          child: FloatingActionButton(
            onPressed: () {},
            heroTag: '$date-$title-back',
            child: Icon(type.icon),
            backgroundColor: type.color,
            elevation: 4.0,
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(left: 16.0),
            child: Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontWeight: FontWeight.w500, fontSize: 15.0),
            ),
          ),
        )
      ],
    );
  }
}

// class EventList extends StatefulWidget {
//   EventList({Key key, this.events, this.scrollPhysics}) : super(key: key);

//   final List<DocumentSnapshot> events;
//   final ScrollPhysics scrollPhysics;

//   @override
//   State<StatefulWidget> createState() {
//     return EventListState();
//   }
// }

// class EventListState extends State<EventList> {
//   final ScrollController _controller = ScrollController();

//   @override
//   Widget build(BuildContext context) {
//     Widget slider = StreamBuilder(
//       stream: ScrollProvider.of(context).progressOutput,
//       builder: (context, snapshot) {
//         double t = 0.0;
//         if (snapshot.hasData) {
//           t = snapshot.data;
//         }

//         return CustomDragSlider(t);
//       },
//     );
//     List<Widget> children = [
//       Stack(
//         alignment: Alignment.topCenter,
//         children: <Widget>[
//           GestureDetector(
//             behavior: HitTestBehavior.opaque,
//             onTap: () {
//               ScrollProvider.of(context)
//                   .scrollStateInput
//                   .add(ScrollState.Closed);
//             },
//             child: Padding(
//               padding: const EdgeInsets.only(top: 16.0, bottom: 16.0),
//               child: slider,
//             ),
//           ),
//         ],
//       )
//     ];

//     for (int index = 0; index < widget.events.length; index++) {
//       final DocumentSnapshot event = widget.events[index];

//       children.add(GestureDetector(
//         behavior: HitTestBehavior.opaque,
//         onTap: () async {
//           // Navigator.push(
//           //   context,
//           //   MyCoolPageRoute(
//           //     fullscreenDialog: true,
//           //     builder: (context) {
//           //       return EventPage(event);
//           //     },
//           //   ),
//           // );
//         },
//         child: Padding(
//           padding: EdgeInsets.only(
//               top: index == 0 ? 8.0 : 0.0,
//               bottom: index == (widget.events.length - 1) ? 32.0 : 0.0),
//           child: EventListTile(
//             event: event,
//             previousEventInList: index > 0 ? widget.events[index - 1] : null,
//             nextEventInList: index < widget.events.length - 1
//                 ? widget.events[index + 1]
//                 : null,
//           ),
//         ),
//       ));
//     }

//     return ListView(
//       physics: widget.scrollPhysics,
//       controller: _controller,
//       children: children,
//     );
//   }
// }

class EventType {
  static final Map<String, EventType> _eventTypes = {
    'party': EventType('party', Icons.cake, Colors.lightBlue),
    'info': EventType('info', Icons.info, Colors.red),
    'social': EventType('social', Icons.group, Colors.purple),
    'excursion': EventType('excursion', Icons.directions_run, Colors.green),
    'activity': EventType('activity', Icons.local_play, Colors.pink),
    'meal': EventType('meal', Icons.restaurant, Colors.cyan),
  };

  EventType(this.type, this.icon, this.color);

  factory EventType.fromTitle(String title) {
    return _eventTypes[title];
  }

  final String type;
  final IconData icon;
  final MaterialColor color;
}

class EventTypes {}

class DayTitle extends StatelessWidget {
  static final List<String> weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  static final List<String> months = [
    'January',
    'Februrary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  DayTitle({this.date});

  DateTime date;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          weekdays[date.weekday - 1],
          textAlign: TextAlign.left,
          style: TextStyle(
              color: Colors.white, fontSize: 40.0, fontWeight: FontWeight.w700),
        ),
        Text(
          '${months[date.month - 1]} ${date.day}',
          textAlign: TextAlign.left,
          style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 16.0,
              fontWeight: FontWeight.w600),
        ),
      ],
    );
  }
}
