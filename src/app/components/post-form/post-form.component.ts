import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import * as ClassicEditor                   from '@ckeditor/ckeditor5-build-balloon-block';
import {CKEditorComponent}                  from '@ckeditor/ckeditor5-angular';
import {Router}                             from '@angular/router';
import {PostService}                        from '../../services/post.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService}                       from '../../services/toast.service';

declare let $: any;

@Component({
    selector     : 'app-post',
    templateUrl  : './post-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostFormComponent implements OnInit, AfterViewInit {
    @ViewChild('ckEditorComponent')
    editorComponent: CKEditorComponent;

    @ViewChild('tags')
    inputTags: ElementRef;

    public Editor = ClassicEditor;

    public form: FormGroup;


    public seo: string;

    public config = {
        mediaEmbed: {
            previewsInData: true,
            // providers: "youtube",
        },
        toolbar   : ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo'],
        block     : ['heading', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo']
    };

    constructor(
        private router: Router,
        private postService: PostService,
        private formBuilder: FormBuilder,
        private toast: ToastService
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title   : ['', [Validators.required]],
            subTitle: ['', []],
            status  : ['PUBLIC', [Validators.required]],
            content : ['', [Validators.required]],
        });
    }

    ngAfterViewInit(): void {
        $(this.inputTags.nativeElement).tagEditor({
            maxTags       : 10,
            sortable      : false,
            autocomplete  : {
                delay   : 0,
                position: {collision: 'flip'},
                source  : []
            },
            forceLowercase: false,
            placeholder   : 'Tags...',
            onInput       : function(e) {
                console.log(e.target.value);
                console.log(this);
            }.bind(this)
        });

        // get instance init tag
        // $(this.inputTags.nativeElement).data('options')

        // addTag
        // $(this.inputTags.nativeElement).tagEditor('addTag', 'taggggggg');
    }

    getEditor() {
        return this.editorComponent.editorInstance;
    }

    onSubmit() {
        let thumbnail = null;
        let img       = this.getEditor().sourceElement.querySelector('img');
        if (img !== null) {
            thumbnail = img.src;
        }

        if (this.form.valid) {
            let post = {
                ...this.form.value,
                contentPlainText: this.getEditor().sourceElement.textContent,
                thumbnail       : thumbnail,
                tags            : $(this.inputTags.nativeElement).tagEditor('getTags')[0].tags
            };

            if (this.seo !== void 0) {
                post.seo = this.seo;
                this.postService.update(post).subscribe(response => {
                    if (response.status === 0) {
                        this.toast.show(response.msg, {class: 'bg-success text-white', delay: 3000});
                    } else {
                        this.toast.show(response.msg, {class: 'bg-danger text-white', delay: 3000});
                    }
                }, error => {
                    this.toast.show('Error!', {class: 'bg-danger text-white', delay: 3000});
                });
            } else {
                this.postService.save(post).subscribe(response => {
                    if (response.status === 0) {
                        this.router.navigateByUrl('/' + response.data.seo);
                        this.toast.show(response.msg, {class: 'bg-success text-white', delay: 3000});
                    } else {
                        this.toast.show(response.msg, {class: 'bg-danger text-white', delay: 3000});
                    }
                }, error => {
                    this.toast.show('Error!', {class: 'bg-danger text-white', delay: 3000});
                });
            }
        } else {
            this.toast.show("Enter the required fields", {class: 'bg-danger text-white', delay: 3000});
        }
    }
}
