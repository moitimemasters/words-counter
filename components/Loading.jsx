import React from 'react'
import { View, Text } from "react-native"
import styled from "react-native-styled.macro"

const Loading = () => {
  return (
    <View {...styled(["flex-1", "items-center", "justify-center"])}>
        <Text {...styled(["text-3xl"])}>Loading...</Text>
    </View>
  )
}

export default Loading