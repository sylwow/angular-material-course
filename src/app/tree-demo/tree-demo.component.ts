import {Component, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';

interface CourseFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface CourseNode {
  name: string;
  children?: CourseNode[];
}

const TREE_DATA: CourseNode[] = [
  {
    name: 'Angular For Beginners',
    children: [
      {
        name: 'Introduction to Angular'
      },
      {
        name: 'Angular Component @Input()'
      },
      {
        name: 'Angular Component @Output()'
      }
    ],
  },
  {
    name: 'Angular Material In Depth',
    children: [
      {
        name: 'Introduction to Angular Material',
        children: [
          {
            name: 'Form Components'
          },
          {
            name: 'Navigation and Containers'
          }
        ],
      },
      {
        name: 'Advanced Angular Material',
        children: [
          {
            name: 'Custom Themes'
          },
          {
            name: 'Tree Components'
          }
        ],
      },
    ],
  },
];

@Component({
  selector: 'tree-demo',
  templateUrl: 'tree-demo.component.html',
  styleUrls: ['tree-demo.component.scss']
})
export class TreeDemoComponent implements OnInit {

  // Nested Tree
  nestedTreeControl = new NestedTreeControl<CourseNode>(node => node.children);

  nestedDataSource = new MatTreeNestedDataSource<CourseNode>();


  // Flat Tree
  flatTreeControl = new FlatTreeControl<CourseFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (node: CourseNode, level: number): CourseFlatNode => {
      return {
        expandable: node.children?.length > 0,
        name: node.name,
        level,
      };
    },
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  flatDataSource = new MatTreeFlatDataSource(this.flatTreeControl, this.treeFlattener);

  ngOnInit() {

    this.flatDataSource.data = TREE_DATA;

    this.nestedDataSource.data = TREE_DATA;

  }

  hasFlatChild = (_: number, node: CourseFlatNode) => node.expandable;

  hasNestedChild = (_: number, node: CourseNode) => !!node.children && node.children.length > 0;

}


