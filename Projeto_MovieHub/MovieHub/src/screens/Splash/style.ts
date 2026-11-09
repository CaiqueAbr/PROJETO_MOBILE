import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent:'center',
        alignItems:'center'
    },
    iconMovie: {
        marginTop: 200,
    },
    title: {
        fontSize: 63,
        color: 'white',
        fontWeight: 'bold',        
    },
    subtitle: {
        fontSize: 20,
        color: colors.textSecondary,
    },
    textLoading: {
        color: colors.text,
        fontSize: 17, 
    },
    subTextLoading: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 40, 
    },
    spinner: {
        marginTop: 'auto',
    }
});