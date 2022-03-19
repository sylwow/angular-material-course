import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize } from 'rxjs/operators';
import { merge, fromEvent, of, throwError } from "rxjs";
import { Lesson } from '../model/lesson';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  course: Course;

  lessons: Lesson[] = [];

  loading = false;

  displayColumns = ['select', 'seqNo', 'description', 'duration'];

  expandedLesson = null;

  selection = new SelectionModel<Lesson>(true, []);

  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService) {

  }

  ngOnInit() {

    this.course = this.route.snapshot.data["course"];
    this.loadLessonsPage();
  }

  loadLessonsPage() {
    const pageIndex = this.paginator?.pageIndex ?? 0,
      pageSize = this.paginator?.pageSize ?? 3,
      direction = this.sort?.direction ?? 'asc',
      sortColumn = this.sort?.active ?? 'seqNo';

    this.loading = true;
    this.coursesService.findLessons(this.course.id, direction, pageIndex, pageSize, sortColumn)
      .pipe(
        catchError(error => {
          console.log(error);
          alert(error);
          return throwError(error);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(lesson => {
        this.lessons = lesson
        this.selection.clear();
      });
  }

  ngAfterViewInit() {

    const sortChange = this.sort.sortChange.pipe(
      tap(_ => this.paginator.pageIndex = 0)
    );

    merge(this.paginator.page, sortChange)
      .subscribe(_ => this.loadLessonsPage());
  }

  onToggleLesson(lesson: Lesson) {
    if (lesson === this.expandedLesson) {
      this.expandedLesson = null;
    }
    else {
      this.expandedLesson = lesson;
    }
  }

  onLessonToggle(lesson: Lesson) {
    this.selection.toggle(lesson);
  }

  onAllLessonToggle() {
    if (this.selection.selected?.length === this.lessons?.length) {
      this.selection.clear();
    } else {
      this.selection.select(...this.lessons);
    }
  }
}
