@component('mail::layout')
{{-- Header --}}
@slot('header')
@component('mail::header', ['url' => config('app.url')])
Seznam výrobků a technologií
@endcomponent
@endslot

{{-- Body --}}
{{ $slot }}

{{-- Subcopy --}}

<table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td>
            Státní fond životního prostředí ČR<br/>
            <a href="https://www.sfzp.cz/">www.sfzp.cz</a>
        </td>
        <td>
            tel.: 800 260 500<br/>
            <a href="mailto:dotazy@sfzp.cz">dotazy@sfzp.cz</a>
        </td>
    </tr>
</table>


{{-- Footer --}}
@slot('footer')
@component('mail::footer')
© {{ date('Y') }} Státní fond životního prostředí České republiky
@endcomponent
@endslot
@endcomponent
