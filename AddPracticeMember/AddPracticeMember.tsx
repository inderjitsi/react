import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import classnames from "classnames"
import React, { useEffect } from 'react'
import ConfirmationDialog from '../../../shared/components/ConfirmationDialog'
import { useAppDispatch, useAppSelector } from '../../../shared/store'
import {
  addMemberToPractice,
  getTotalPracticeUsers,
} from "../../../shared/store/auth/actions"
import _ from '../../../shared/utils/lodashExtensions'
import { useAddPracticeMemberStyles } from './AddPracticeMember.styles'

const AddPracticeMember: React.FC<{ handleShowTable: Function }> = (props) => {
  const dispatch = useAppDispatch()
  const classes = useAddPracticeMemberStyles()

  const auth = useAppSelector((state) => state.auth)
  const stateErrors = useAppSelector((state) => state.errors)

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [maxLimitReachedMsg, setMaxLimitReachedMsg] = React.useState('')
  const [addButtonClick, setAddButtonClick] = React.useState(false)
  const [addMemberDialog, setAddMemberDialog] = React.useState(false)
  const [confirmAddMember, setConfirmAddMember] = React.useState(false)

  const [errors, setErrors] = React.useState({
    name: '',
    email: '',
  })

  useEffect(() => {
    dispatch(
      getTotalPracticeUsers({
        practice_id: auth.userdata.practice_id,
      })
    )
  }, [])

  useEffect(() => {
    setName('')
    setEmail('')
    setMaxLimitReachedMsg('')
    setTotalUsers(+auth.totalPracticeMember)

    if (auth.totalPracticeMember >= auth.practiceData.max_users) {
      setMaxLimitReachedMsg("Total allowed users for your Practice has exceeded the set: " + auth.practiceData.max_users)
    }
    if(addButtonClick && _.isEmpty(stateErrors)){
      props.handleShowTable()
    }
    setAddButtonClick(false)
  }, [auth.totalPracticeMember])

  useEffect(() => {
    let state_errors: any = stateErrors
    setErrors(state_errors)
  }, [stateErrors])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleClose = () => {
    setAddMemberDialog(false)
  }

  const handleConfirmAddMember = () => {
    setAddMemberDialog(false)
    setConfirmAddMember(true)
    handleAddMember()
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault()

    let error_obj = {name: '', email: ''}
    let max_users = auth.practiceData.max_users

    if (name === '') {
      error_obj = {
        name: "Name field is required.",
        email: "",
      }
      setErrors(error_obj)
    } else if (email === '') {
      error_obj = {
        name: "",
        email: "Email field is required."
      }
      setErrors(error_obj)
    } else if(!confirmAddMember && totalUsers >= max_users){
      setErrors(error_obj)
      setAddMemberDialog(true)
    } else {
      handleAddMember()
    }
  }

  const handleAddMember = () => {

    var memberName = name.split(" ")
    var firstName = memberName[0]
    var lastName = memberName[1] ? memberName[1] : memberName[0]

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      practice_id: auth.userdata.practice_id,
      max_users: auth.practiceData.max_users,
    }
    dispatch(addMemberToPractice(newUser))
    setConfirmAddMember(false)
    setAddButtonClick(true)
  }

  const showListTable = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.handleShowTable()

    dispatch({
      type: 'GET_ERRORS',
      payload: {},
    })
  }

  return (
    <Card className={classes.root}>
      <CardHeader title="Add member to your practice" />
      <Divider />
      <div style={{padding:"20px 20px 0"}}>
        <Typography style={{ paddingBottom: "5px" }}>
          Add a new member to your practice by sending an email below. You can only add the set number of members to your practice.
        </Typography>
        <Typography style={{ paddingBottom: "5px", fontSize: 13, fontWeight: 800, color: "red" }}>
          {maxLimitReachedMsg}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField margin="normal" variant="outlined" required fullWidth name="name"
              style={{ marginLeft: 0, flexDirection: "row", display: "flex", justifyContent: "auto", width: "100%" }}
              label="Provider Full Name"
              value={name}
              onChange={handleNameChange}
              className={classnames("", {
                invalid: errors.name
              })}
            />
            <Typography
              color="error"
              className={classes.errorText}
            >
              {errors.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" variant="outlined" required fullWidth id="providerEmail" name="email" type="email"
              style={{ marginLeft: 0, flexDirection: "row", display: "flex", justifyContent: "auto", width: "100%"}}
              value={email}
              label="Email Address"
              onChange={handleEmailChange}
              className={classnames("", {
                invalid: errors.email
              })}
            />
            <Typography
              color="error"
              className={classes.errorText}
            >
              {errors.email}
            </Typography>
          </Grid>
        </Grid>

        <ConfirmationDialog
          message="You have already added max members in practice, if you add more it will cost you. Are you sure you want to add member?"
          title="Add Member"
          okOperationDialog={handleConfirmAddMember}
          handleClose={handleClose}
          dialogState={addMemberDialog}
        />

      </div>

      <CardActions className={classes.cardBottom}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          //disabled={totalUsers>=auth.practiceData.max_users}
        >
          Add Member
        </Button>
        <Button
          variant="contained"
          onClick={showListTable}
        >
          Cancel
        </Button>
      </CardActions>

    </Card>
  )
}

export default AddPracticeMember
