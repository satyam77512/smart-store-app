import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from '@/constants/theme'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    height: 50, 
                    paddingBottom: 5,
                    paddingTop: 5,
                },
            }}
        >
            <Tabs.Screen name="index"
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen name="scanner"
                options={{
                    tabBarIcon: ({ size }) => <Ionicons name="scan" size={size} color={COLORS.primary} />,
                }}
            />
            <Tabs.Screen name="Cart"
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="cart" size={size} color={color} />,
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="person-circle" size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}