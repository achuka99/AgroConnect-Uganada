import { View} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './store';
import { BottomNavigation, PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import WeatherScreen from './screens/WeatherScreen';
import CommunityScreen from './screens/CommunityScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreatePostScreen from './screens/CreatePostScreen';
import PostDetailsScreen from './screens/PostDetailsScreen';
import { LoginScreen, RegisterScreen } from './screens/LoginAndRegisterScreens';
import ProfileScreen from './screens/ProfileScreen';
import AppBar from './Components/AppBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


console.disableYellowBox = true;

function BottomTabs(){
  return (
    <Tab.Navigator
      screenOptions={{
        //headerShown: false,
        header: (props) => <AppBar {...props} />,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarLabel: 'Weather',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="weather-cloudy-clock" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="wechat" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account-outline" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
    
  )
}

const customTheme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(16, 109, 32)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(157, 248, 152)',
    onPrimaryContainer: 'rgb(0, 34, 4)',
    secondary: 'rgb(82, 99, 79)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(213, 232, 206)',
    onSecondaryContainer: 'rgb(17, 31, 15)',
    tertiary: 'rgb(56, 101, 106)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(188, 235, 240)',
    onTertiaryContainer: 'rgb(0, 32, 35)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(252, 253, 246)',
    onBackground: 'rgb(26, 28, 25)',
    surface: 'rgb(252, 253, 246)',
    onSurface: 'rgb(26, 28, 25)',
    surfaceVariant: 'rgb(222, 229, 216)',
    onSurfaceVariant: 'rgb(66, 73, 64)',
    outline: 'rgb(114, 121, 111)',
    outlineVariant: 'rgb(194, 201, 189)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(47, 49, 45)',
    inverseOnSurface: 'rgb(240, 241, 235)',
    inversePrimary: 'rgb(130, 219, 126)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(240, 246, 235)',
      level2: 'rgb(233, 242, 229)',
      level3: 'rgb(226, 237, 223)',
      level4: 'rgb(224, 236, 220)',
      level5: 'rgb(219, 233, 216)',
    },
    surfaceDisabled: 'rgba(26, 28, 25, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 25, 0.38)',
    backdrop: 'rgba(44, 50, 42, 0.4)',
    roundness: 0,
  },
};

const App = () => {
  return (
    <Provider store={store}>
        <PaperProvider theme={customTheme}>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
            headerShown: false,
          }} >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Home" component={BottomTabs} />
              <Stack.Screen name="CreatePosts" component={CreatePostScreen} />
              <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </PaperProvider>
    </Provider>
  )
}

export default App