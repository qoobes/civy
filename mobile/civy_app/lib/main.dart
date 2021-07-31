import 'package:civy_app/screens/home.dart';
import 'package:civy_app/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';

main(List<String> args) async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginScreen(),
      theme: ThemeData(
          primaryColor: HexColor.fromHex("#069191"),
          fontFamily:
              GoogleFonts.openSans(fontWeight: FontWeight.bold).fontFamily),
    ),
  );
}

class LoginScreen extends StatelessWidget {
  Duration get loginTime => Duration(milliseconds: 1250);

  LoginScreen() {
    Firebase.initializeApp().whenComplete(() {
      print("completed");
    });
  }

  Future<String> _authUser(LoginData data) async {
    print('Name: ${data.name}, Password: ${data.password}');
    return Future.delayed(loginTime).then((_) async {
      try {
        print("Signing in...");
        UserCredential userCredential = await FirebaseAuth.instance
            .signInWithEmailAndPassword(
                email: data.name, password: data.password);
      } on FirebaseAuthException catch (e) {
        if (e.code == 'user-not-found') {
          return 'The email does not exist!';
        } else if (e.code == 'wrong-password') {
          return 'The password does not match!';
        }
      }
      return null;
    });
  }

  Future<String> _recoverPassword(String name) {
    print('Name: $name');
    return Future.delayed(loginTime).then((_) {
      // if (!users.containsKey(name)) {
      //   return 'User not exists';
      // }
      return null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return FlutterLogin(
      hideSignUpButton: false,
      title: 'Civy',
      onLogin: _authUser,
      onSignup: _authUser,
      onSubmitAnimationCompleted: () {
        Navigator.of(context)
            .pushReplacement(MaterialPageRoute(builder: (context) => Home()));
      },
      onRecoverPassword: _recoverPassword,
    );
  }
}
