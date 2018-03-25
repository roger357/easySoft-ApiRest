import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Commit} from '../entities/commit';
import {CommittedFile} from '../entities/committedfile';
import {FileDiff} from '../entities/filediff';
import {GitService} from '../git.service';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent implements OnInit {

  @Input() commitHash: string;
  commit: Commit;
  committedFiles: CommittedFile[] = [];
  selectedDiffs: FileDiff[] = [];

  constructor(private route: ActivatedRoute,
              private gitService: GitService) {
  }

  ngOnInit() {
    this.commitHash = this.route.snapshot.paramMap.get('sha');
    this.getCommitInfo();
  }

  getCommitInfo(): void {
    this.gitService.getCommit(this.commitHash, 0)
      .subscribe(commit => this.commit = commit,
        () => console.log('Error in CommitComponent#getCommitInfo()'),
        () => this.getCommitFilesDiffs());
  }

  getCommitFilesDiffs(): void {
    console.log(this.commit.sha);
    this.gitService.getCommitedFileDiffs(this.commit.sha)
      .subscribe(committedFiles => this.committedFiles = committedFiles,
        () => console.log('Error in CommitComponent#getCommitFilesDiffs()'),
        () => this.refreshDiffView(this.committedFiles[0]));
  }

  refreshDiffView(committedFile: CommittedFile): void {
    this.selectedDiffs = committedFile.fileDiffs;
  }

}
