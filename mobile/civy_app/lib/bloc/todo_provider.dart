import 'package:civy_app/bloc/todo_bloc.dart';
import 'package:flutter/material.dart';

class TodoProvider extends InheritedWidget {

  final TodoBloc scheduleBloc;

  TodoProvider({
    Key key,
    this.scheduleBloc,
    Widget child
  }) : super(key: key, child: child);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) {
    return true;
  }

  static TodoBloc of(BuildContext context) =>
      (context.dependOnInheritedWidgetOfExactType<TodoProvider>())
          .scheduleBloc;
}