import { makeStyles, Theme } from '@material-ui/core'

export const useAddPracticeMemberStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  errorText: {
    fontSize: 12,
    fontWeight: 500,
  },
  heading: {
    fontSize: theme.typography.pxToRem(30),
    fontWeight: theme.typography.fontWeightRegular,
  },
  mainNewCaseWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
    backgroundColor: "#fff",
    paddingTop: theme.spacing(2.5),
    paddingRight: theme.spacing(3.5),
    paddingLeft: theme.spacing(2.5),
    paddingBottom: theme.spacing(4),
  },
  cardBottom: {
    marginLeft: '0.5rem',
    marginBottom: '1rem',
  }
}))