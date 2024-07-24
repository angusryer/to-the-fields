import React from 'react';
import { dev } from '../utils/console';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable, StyleSheet, ColorValue } from 'react-native';
import HttpService from '../services/HttpService';
import { ERole, TRole, routes } from 'shared';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Buttons';
import Svg, { Circle } from 'react-native-svg';
import Txt from '../components/Txt';
import { spaces, useStyles } from '../utils/theme';

type OnboardingContextValues = {
  selectedRole: TRole | null;
  setSelectedRole: (role: TRole) => void;
};

const OnboardingContext = React.createContext<OnboardingContextValues | null>(
  null,
);

const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedRole, setSelectedRole] = React.useState<TRole | null>(null);

  return (
    <OnboardingContext.Provider value={{ selectedRole, setSelectedRole }}>
      {children}
    </OnboardingContext.Provider>
  );
};

const useOnboarding = () => {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

const OnboardingStack = createNativeStackNavigator();

function OnboardingStackNavigator(): React.JSX.Element {
  return (
    <OnboardingProvider>
      <OnboardingStack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: { padding: spaces[16] },
        }}>
        <OnboardingStack.Screen name="Welcome" component={Welcome} />
        <OnboardingStack.Screen
          name="SelectAccountPurpose"
          component={SelectAccountPurpose}
        />
        <OnboardingStack.Screen
          name="FinishRegistration"
          component={FinishRegistration}
        />
      </OnboardingStack.Navigator>
    </OnboardingProvider>
  );
}

export default OnboardingStackNavigator;

const Welcome = ({ navigation }: INavigationProps) => {
  const { t } = useTranslation(['common', 'onboarding']);
  const { selectedRole, setSelectedRole } = useOnboarding();

  const nextScreen = () => {
    if (!selectedRole) return;
    navigation.navigate('SelectAccountPurpose');
  };

  return (
    <View style={styles.view}>
      <View>
        <Txt.H1>{t('welcome', { ns: 'onboarding' })}</Txt.H1>
        <Txt.Para>{t('message', { ns: 'onboarding' })}</Txt.Para>
        <View>
          <RadioButton
            onSelect={() => setSelectedRole(ERole.Organizer)}
            isSelected={selectedRole === ERole.Organizer}
            label={t('roles.organizer', { ns: 'onboarding' })}
          />
          <RadioButton
            onSelect={() => setSelectedRole(ERole.Parent)}
            isSelected={selectedRole === ERole.Parent}
            label={t('roles.parent', { ns: 'onboarding' })}
          />
        </View>
      </View>

      <Button onPress={nextScreen}>
        <Text>{t('buttons.next', { ns: 'common' })}</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export interface IRadioButtonProps {
  size?: number;
  label?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

const RadioButton = ({
  size = 24,
  label,
  isSelected = false,
  onSelect,
}: IRadioButtonProps) => {
  const styles = useStyles((colors) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spaces[4],
    },
    label: {
      marginLeft: spaces[4],
      color: colors.text,
    },
    svg: {
      color: colors.text,
      marginRight: spaces[4],
    },
  }));
  const radius = size / 2;
  const innerRadius = radius * 0.5;

  return (
    <Pressable onPress={onSelect} style={styles.container}>
      <Svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke={styles.svg.color}
          strokeWidth={2}
          fill="none"
        />
        {isSelected && (
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill={styles.svg.color}
          />
        )}
      </Svg>
      {label && <Txt.Para style={styles.label}>{label}</Txt.Para>}
    </Pressable>
  );
};

const SelectAccountPurpose = ({ navigation, route }: INavigationProps) => {
  const { selectedRole, setSelectedRole } = useOnboarding();

  const nextScreen = () => {
    dev('Navigating to next screen');
    // Check if user selections are valid
    navigation.navigate('FinishRegistration');
  };

  return (
    <View>
      <Text>{selectedRole}</Text>
      <Text>Enter some pertinent info here</Text>
      <Pressable onPress={nextScreen}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
};

const FinishRegistration = ({ navigation }: INavigationProps) => {
  const { selectedRole, setSelectedRole } = useOnboarding();

  const register = async () => {
    dev('Registering...', selectedRole);
    try {
      const result = await HttpService.post(routes.auth.register, {
        role: selectedRole,
      });
      dev('Result:', result);
      // navigation.navigate('AppTabNavigator');
    } catch (error) {
      dev('Error:', error);
    }
  };

  return (
    <View>
      <Text>Finish registration</Text>
      <Pressable onPress={register}>
        <Text>Finish Registration</Text>
      </Pressable>
    </View>
  );
};
