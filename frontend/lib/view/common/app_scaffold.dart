import 'package:flutter/material.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({super.key, required this.body, this.selectedIndex = 0, this.onDestinationSelected});

  final Widget body;
  final int selectedIndex;
  final ValueChanged<int>? onDestinationSelected;

  @override
  Widget build(BuildContext context) {
    final destinations = const [
      NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: '대시보드'),
      NavigationDestination(icon: Icon(Icons.inventory_2_outlined), label: '자산'),
      NavigationDestination(icon: Icon(Icons.verified_outlined), label: '인증'),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 840;

        if (isWide) {
          return Scaffold(
            appBar: AppBar(title: const Text('OA Asset Manager')),
            body: Row(
              children: [
                NavigationRail(
                  selectedIndex: selectedIndex,
                  onDestinationSelected: onDestinationSelected,
                  destinations: destinations
                      .map(
                        (destination) => NavigationRailDestination(
                          icon: destination.icon,
                          label: Text(destination.label),
                        ),
                      )
                      .toList(),
                ),
                const VerticalDivider(width: 1),
                Expanded(child: body),
              ],
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(title: const Text('OA Asset Manager')),
          body: body,
          bottomNavigationBar: NavigationBar(
            selectedIndex: selectedIndex,
            destinations: destinations,
            onDestinationSelected: onDestinationSelected,
          ),
        );
      },
    );
  }
}
