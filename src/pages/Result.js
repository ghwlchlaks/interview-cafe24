import React, { Component } from 'react';
import './Result.css';
import { Redirect } from 'react-router-dom';
import ResultListWrapper from '../components/ResultListWrapper';
import { Container } from 'reactstrap';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schedules: []
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.printProps(this.props.location.state.selectedSubjects);
    }
  }

  printProps(subjects) {
    let newArr = [];

    for (let index in subjects) {
      if (subjects[index].grades === 3) {
        subjects[index].times_combination = this.getAllCombinations(
          subjects[index].times,
          2
        );
      } else {
        subjects[index].times_combination = subjects[index].times;
      }
    }

    this.recursive(subjects, [], [], 0, newArr);
    this.setState({
      schedules: newArr
    });
  }

  getAllCombinations(arr, m) {
    const combinations = [];
    const picked = [];
    const used = [];
    for (let item of arr) used.push(0);

    function find(picked) {
      if (picked.length === m) {
        let rst = [];
        for (let i of picked) {
          rst = rst.concat(arr[i]);
        }
        combinations.push(rst);
        return;
      } else {
        let start = picked.length ? picked[picked.length - 1] + 1 : 0;
        for (let i = start; i < arr.length; i++) {
          if (i === 0 || arr[i] !== arr[i - 1] || used[i - 1]) {
            picked.push(i);
            used[i] = 1;
            find(picked);
            picked.pop();
            used[i] = 0;
          }
        }
      }
    }
    find(picked);
    return combinations;
  }

  recursive(arr, data, data1, index, newArr) {
    let firsts;
    if (arr[index]) {
      firsts = arr[index].times_combination;
    }

    if (arr.length === index) {
      newArr.push(data);
      return data;
    }

    for (let i in firsts) {
      const b = data1.concat(firsts[i]);
      const a = data.concat({
        ...arr[index],
        enable_times: firsts[i]
      });

      let isDuplicated = false;

      // 중복 검사
      for (let j = 0; j < b.length; j++) {
        for (let q = j + 1; q < b.length; q++) {
          if (b[j] === b[q]) {
            isDuplicated = true;
            break;
          }
        }
      }

      if (!isDuplicated) {
        this.recursive(arr, a, b, index + 1, newArr);
      }
    }
  }

  render() {
    return (
      <Container>
        {!this.props.location.state ? (
          <Redirect to="/" />
        ) : (
          <div>
            {!this.state.schedules.length > 0 ? (
              <div> Loading...</div>
            ) : (
              <ResultListWrapper schedules={this.state.schedules} />
            )}
          </div>
        )}
      </Container>
    );
  }
}
