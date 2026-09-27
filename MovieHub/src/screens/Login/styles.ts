import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: colors.background,
    padding: 24, 
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 15, 
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.text,
  },
  buttonPrimary: {
    backgroundColor: '#F95268',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: '#C5BCBF',
    fontSize: 14,
  },
  registerHighlight: {
    color: '#F95268',
    fontWeight: 'bold',
  },
});

export default styles;