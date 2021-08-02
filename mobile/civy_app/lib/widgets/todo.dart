import 'package:civy_app/utils.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Todo extends StatelessWidget {
  final String title;
  final String details;
  const Todo({this.title, this.details});

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(48.0),
        child: Material(
            elevation: 14.0,
            borderRadius: BorderRadius.circular(12.0),
            shadowColor: HexColor.fromHex("#069191"),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.topLeft,
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Icon(
                      Icons.pending_actions,
                      size: 40,
                      color: Colors.orange[200],
                    ),
                  ),
                ),
                Spacer(),
                Align(
                  alignment: Alignment.topLeft,
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      title,
                      style: TextStyle(
                          color: HexColor.fromHex("#069191"),
                          fontSize: 50,
                          fontFamily: GoogleFonts.montserrat(
                                  fontWeight: FontWeight.w200)
                              .fontFamily),
                    ),
                  ),
                ),
                Align(
                    alignment: Alignment.bottomLeft,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Chip(
                          label: Text(
                        details,
                        style: TextStyle(fontSize: 10),
                      )),
                    )),
                Align(
                    alignment: Alignment.bottomLeft,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: LinearProgressIndicator(),
                    ))
              ],
            )
            // child: Container(
            //   child: Align(
            //     alignment: Alignment.topCenter,
            //     child: Text(title,
            //         style: TextStyle(
            //             color: HexColor.fromHex("#069191"),
            //             fontSize: 50,
            //             fontFamily: GoogleFonts.montserrat().fontFamily)),
            //   ),
            // )),
            ));
  }
}
